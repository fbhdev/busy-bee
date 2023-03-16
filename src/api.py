import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from database import Database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization"],
)

load_dotenv()
# db = Database('mock.db')
db = Database(os.getenv('DB_NAME'))


# /v1/careers
@app.get("/v1/careers")
async def get_careers(response: Response) -> list:
    """
    Returns all the careers in the database.
    :param response: Response
    :return: list
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    data = {"careers": []}
    for item in db.view():
        data["careers"].append({
            "id": item[0],
            "applied": item[1],
            "title": item[2],
            "location": item[3],
            "employer": item[4],
            "description": item[5],
            "url": item[6]
        })
    data['careers'].reverse()
    return data["careers"]


# /v1/careers/{title}
@app.get("/v1/careers/{title}")
async def get_careers_by_location(title: str, response: Response):
    """
    Returns all the careers in the database.
    :param title: str
    :param response: Response
    :return: dict
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    data = {"careers": []}
    for item in db.view_title(title):
        data["careers"].append({
            "id": item[0],
            "applied": item[1],
            "title": item[2],
            "location": item[3],
            "employer": item[4],
            "description": item[5],
            "url": item[6]
        })
    return data["careers"]


# /v1/careers/{location}
@app.get("/v1/careers/{location}")
async def get_careers_by_location(location: str, response: Response):
    """
    Returns all the careers in the database.
    :param location: str
    :param response: Response
    :return: dict
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    data = {"careers": []}
    for item in db.view_location(location):
        data["careers"].append({
            "id": item[0],
            "applied": item[1],
            "title": item[2],
            "location": item[3],
            "employer": item[4],
            "description": item[5],
            "url": item[6]
        })
    return data["careers"]


# /v1/careers/search/{query}
@app.get("/v1/careers/search/{query}")
async def get_careers_by_query(query: str, response: Response):
    """
    Returns all the careers in the database.
    :param query: str
    :param response: Response
    :return: dict
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    data = {"careers": []}
    for item in db.view_one(query):
        data["careers"].append({
            "id": item[0],
            "applied": item[1],
            "title": item[2],
            "location": item[3],
            "employer": item[4],
            "description": item[5],
            "url": item[6]
        })
    return data["careers"]


# /v1/careers/{employer}
@app.get("/v1/careers/{employer}")
async def get_careers_by_location(employer: str, response: Response):
    """
    Returns all the careers in the database.
    :param employer: str
    :param response: Response
    :return: dict
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    data = {"careers": []}
    for item in db.view_employer(employer):
        data["careers"].append({
            "id": item[0],
            "applied": item[1],
            "title": item[2],
            "location": item[3],
            "employer": item[4],
            "description": item[5],
            "url": item[6]
        })
    return data["careers"]


@app.get("/v1/careers/data/locations")
async def get_most_applied_locations(response: Response) -> dict:
    """
    Returns the most applied locations in the database.
    :param response: Response
    :return: dict
    """
    response.headers['Cache-Control'] = "public, max-age=86400"
    response.headers['Expires'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(time.time() + 86400))
    result = db.most_applied_location()
    return {"name": result[0][0], "value": result[0][1]}


# /v1/careers
@app.post("/v1/careers")
async def create_career(request: Request) -> dict:
    """
    Creates a new career
    :return: dict
    """
    response = await request.json()
    date = time.strftime("%Y-%m-%d")
    title = response['title']
    location = response['location']
    employer = response['employer']
    description = response['description']
    url = response['url']
    data = {
        'applied': date,
        'title': title,
        'location': location,
        'employer': employer,
        'description': description,
        'url': url
    }
    try:
        db.insert(data)
        return {'status': "Success!"}
    except Exception as e:
        print(e)
        return {'status': "Failed!"}
