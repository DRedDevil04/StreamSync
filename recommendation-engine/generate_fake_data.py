# pip install faker pandas

import pandas as pd
import random
import uuid
from faker import Faker

fake = Faker()

# Parameters
NUM_USERS = 1000
NUM_MOVIES = 300
NUM_INTERACTIONS = 10000

GENRES = ["Action", "Comedy", "Drama", "Romance", "Thriller", "Sci-Fi", "Fantasy", "Horror", "Adventure", "Animation"]

def generate_users(n=NUM_USERS):
    users = []
    for _ in range(n):
        user_id = f"U{str(uuid.uuid4())[:8]}"
        username = fake.user_name()
        email = fake.email()
        tags = random.sample(GENRES, k=random.randint(2, 5))
        users.append([user_id, username, email, "|".join(tags)])
    return pd.DataFrame(users, columns=["userId", "username", "email", "tags"])

def generate_movies(n=NUM_MOVIES):
    movies = []
    for i in range(n):
        movie_id = f"M{str(uuid.uuid4())[:8]}"
        title = fake.catch_phrase()
        genres = random.sample(GENRES, k=random.randint(1, 3))
        rating = round(random.uniform(2.5, 5.0), 1)
        movies.append([movie_id, title, "|".join(genres), rating])
    return pd.DataFrame(movies, columns=["movieId", "title", "genre", "rating"])

def generate_interactions(users_df, movies_df, n=NUM_INTERACTIONS):
    interactions = []
    for _ in range(n):
        user = users_df.sample().iloc[0]
        movie = movies_df.sample().iloc[0]
        timestamp = fake.date_time_this_year().isoformat()
        interactions.append([user["userId"], movie["movieId"], timestamp])
    return pd.DataFrame(interactions, columns=["userId", "movieId", "timestamp"])

if __name__ == "__main__":
    print("Generating synthetic data...")

    users = generate_users()
    movies = generate_movies()
    interactions = generate_interactions(users, movies)

    users.to_csv("users.csv", index=False)
    movies.to_csv("movies.csv", index=False)
    interactions.to_csv("interactions.csv", index=False)

    print("✅ Data generated:")
    print(" - users.csv")
    print(" - movies.csv")
    print(" - interactions.csv")
