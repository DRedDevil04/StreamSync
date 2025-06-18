from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pickle
import pandas as pd
import numpy as np

# Initialize API
app = FastAPI()

# Load models and data
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("dataset.pkl", "rb") as f:
    dataset = pickle.load(f)

movies_df = pd.read_csv("movies.csv")
movie_ids = list(movies_df["movieId"].values)
movie_id_to_index = {movie_id: i for i, movie_id in enumerate(movie_ids)}
index_to_movie_id = {i: movie_id for movie_id, i in movie_id_to_index.items()}

# Input schema
class UserInput(BaseModel):
    user_id: str

class GroupInput(BaseModel):
    user_ids: List[str]


# 🔹 Recommend for single user
@app.post("/recommend/user")
def recommend_user(data: UserInput):
    try:
        user_mapping = dataset.mapping()[0]
        user_index = user_mapping[data.user_id]
        scores = model.predict(user_ids=user_index, item_ids=np.arange(len(movie_ids)))
        top_indices = np.argsort(-scores)[:10]
        movie_titles = movies_df.set_index("movieId").loc[[index_to_movie_id[int(i)] for i in top_indices]]["title"].tolist()
        return {"user_id": data.user_id, "recommendations": movie_titles}
    except KeyError:
        raise HTTPException(status_code=404, detail="User ID not found")


# 🔹 Recommend for group of users
@app.post("/recommend/group")
def recommend_group(data: GroupInput):
    try:
        user_mapping = dataset.mapping()[0]
        user_vecs, item_vecs = model.get_user_representations()[1], model.get_item_representations()[1]

        collected_vecs = []
        for uid in data.user_ids:
            if uid in user_mapping:
                collected_vecs.append(user_vecs[user_mapping[uid]])

        if not collected_vecs:
            raise HTTPException(status_code=404, detail="No valid user IDs found")

        valid_user_vecs = np.vstack(collected_vecs)
        group_vec = np.mean(valid_user_vecs, axis=0)

        if group_vec.ndim != 1:
            raise HTTPException(status_code=500, detail=f"Invalid group vector shape: {group_vec.shape}")

        scores = item_vecs @ group_vec
        top_indices = np.argsort(-scores)[:10]

        movie_titles = []
        for idx in top_indices:
            movie_id = index_to_movie_id.get(int(idx))
            if movie_id in movies_df.set_index("movieId").index:
                title = movies_df.set_index("movieId").loc[movie_id]["title"]
                movie_titles.append(title)

        return {"group": data.user_ids, "recommendations": movie_titles}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
