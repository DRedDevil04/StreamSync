import pickle
import numpy as np
import pandas as pd
from lightfm import LightFM

# Load saved model and dataset
with open("model.pkl", "rb") as f:
    model: LightFM = pickle.load(f)

with open("dataset.pkl", "rb") as f:
    dataset = pickle.load(f)

# Load movie metadata
movies_df = pd.read_csv("movies.csv")  # movieId,title,genre,rating,tags

# Map movie IDs to internal LightFM indices
movie_ids = list(movies_df["movieId"].values)
movie_id_to_index = {movie_id: i for i, movie_id in enumerate(movie_ids)}
index_to_movie_id = {i: movie_id for movie_id, i in movie_id_to_index.items()}


# 🔹 Predict Top-N movies for a single user
def recommend_for_user(user_id: str, top_n=10):
    user_mapping = dataset.mapping()[0]
    if user_id not in user_mapping:
        print(f"❌ User {user_id} not found in dataset.")
        return []
    
    user_index = user_mapping[user_id]
    scores = model.predict(user_ids=user_index, item_ids=np.arange(len(movie_ids)))
    top_indices = np.argsort(-scores)[:top_n]
    
    return [index_to_movie_id[i] for i in top_indices if i in index_to_movie_id]

# 🔹 Predict Top-N movies for a group of users
def recommend_for_group(group_users: list[str], top_n=10):
    user_mapping = dataset.mapping()[0]
    
    # Collect predictions for each valid user
    all_scores = []
    valid_users = []
    
    for uid in group_users:
        if uid in user_mapping:
            user_index = user_mapping[uid]
            scores = model.predict(user_ids=user_index, item_ids=np.arange(len(movie_ids)))
            all_scores.append(scores)
            valid_users.append(uid)
        else:
            print(f"⚠️ User {uid} not in dataset mapping.")
    
    if not all_scores:
        print(f"⚠️ No valid users found for group: {group_users}")
        return []
    
    print(f"✅ Found {len(valid_users)} valid users: {valid_users}")
    
    # Average the scores across all users
    group_scores = np.mean(all_scores, axis=0)
    top_indices = np.argsort(-group_scores)[:top_n]
    
    return [index_to_movie_id[i] for i in top_indices if i in index_to_movie_id]


# 🔸 Helper to print titles
def print_movie_titles(movie_ids_list):
    if not movie_ids_list:
        return []
    try:
        titles = movies_df.set_index("movieId").loc[movie_ids_list]["title"].tolist()
    except KeyError as e:
        print(f"❌ Some movie IDs not found in metadata: {e}")
        # Try to get titles for valid IDs only
        valid_ids = [mid for mid in movie_ids_list if mid in movies_df["movieId"].values]
        if valid_ids:
            titles = movies_df.set_index("movieId").loc[valid_ids]["title"].tolist()
            return titles
        return []
    return titles


# 🔸 Example Usage
if __name__ == "__main__":
    single_user = "Ub8152c08"
    group_users = ["Ub8152c08", "U762d8c14", "U96808ff0","U13f12ed0"]


    print("🎯 Top Movies for User", single_user)
    user_recs = recommend_for_user(single_user)
    user_titles = print_movie_titles(user_recs)
    print(user_titles)

    print("\n🎯 Top Movies for Group ", group_users)
    group_recs_alt = recommend_for_group(group_users)
    group_titles_alt = print_movie_titles(group_recs_alt)
    print(group_titles_alt)