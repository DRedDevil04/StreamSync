# pip install lightfm pandas numpy scikit-learn

import numpy as np
import pandas as pd
from lightfm import LightFM
from lightfm.data import Dataset
import pickle

# Step 1: Load your data (replace with actual files later)
users_df = pd.read_csv("users.csv")             # userId,tags
movies_df = pd.read_csv("movies.csv")           # movieId,title,genre,rating,tags
interactions_df = pd.read_csv("interactions.csv")  # userId,movieId,rating,timestamp

# Step 2: Collect unique IDs
user_ids = users_df['userId'].unique()
movie_ids = movies_df['movieId'].unique()
all_tags = set(tag for sublist in movies_df['tags'].str.split(',') for tag in sublist)

# Step 3: Initialize LightFM Dataset
dataset = Dataset()
dataset.fit(users=user_ids, items=movie_ids)
dataset.fit_partial(users=user_ids, items=movie_ids, item_features=all_tags)

# Step 4: Build interactions
interactions_data = [(row['userId'], row['movieId']) for _, row in interactions_df.iterrows()]
(interactions, _) = dataset.build_interactions(interactions_data)

# Step 5: Build item features (tags as features)
item_features_data = []
for _, row in movies_df.iterrows():
    tags = row['tags'].split(',')
    item_features_data.append((row['movieId'], tags))

item_features = dataset.build_item_features(item_features_data)

# Step 6: Train the LightFM model
model = LightFM(loss='warp')  # WARP works well for implicit data
model.fit(interactions, item_features=item_features, epochs=30, num_threads=4)

# Step 7: Save model and metadata
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("dataset.pkl", "wb") as f:
    pickle.dump(dataset, f)

print("✅ Model training complete and saved.")
