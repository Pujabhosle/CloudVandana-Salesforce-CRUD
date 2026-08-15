import os
import secrets
import hashlib
import base64
import requests

from urllib.parse import urlencode
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("SALESFORCE_CLIENT_ID")
CLIENT_SECRET = os.getenv("SALESFORCE_CLIENT_SECRET")
LOGIN_URL = os.getenv("SALESFORCE_LOGIN_URL")
REDIRECT_URI = os.getenv("SALESFORCE_REDIRECT_URI")

# Store PKCE verifiers temporarily
pkce_store = {}
salesforce_access_token = None
salesforce_instance_url = None


def create_code_verifier():
    """
    Creates a random PKCE code verifier.
    """
    return secrets.token_urlsafe(64)


def create_code_challenge(code_verifier):
    """
    Creates the PKCE S256 code challenge.
    """

    digest = hashlib.sha256(
        code_verifier.encode("utf-8")
    ).digest()

    return base64.urlsafe_b64encode(
        digest
    ).decode("utf-8").rstrip("=")


@router.get("/auth/login")
def salesforce_login():

    # Create PKCE verifier
    code_verifier = create_code_verifier()

    # Create PKCE challenge
    code_challenge = create_code_challenge(code_verifier)

    # Create state value
    state = secrets.token_urlsafe(32)

    # Save verifier temporarily
    pkce_store[state] = code_verifier

    # Salesforce OAuth parameters
    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }

    authorization_url = (
        f"{LOGIN_URL}/services/oauth2/authorize?"
        + urlencode(params)
    )

    return RedirectResponse(url=authorization_url)


@router.get("/auth/callback")
def salesforce_callback(code: str, state: str):

    # Get the original verifier
    code_verifier = pkce_store.pop(state, None)

    if not code_verifier:
        return {
            "error": "Invalid or expired OAuth state"
        }

    # Salesforce token endpoint
    token_url = f"{LOGIN_URL}/services/oauth2/token"

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code_verifier": code_verifier
    }

    response = requests.post(
        token_url,
        data=data
    )

    if response.status_code != 200:
        return {
            "error": "Salesforce authentication failed",
            "details": response.text
        }

    token_data = response.json()

    # return {
    #     "message": "Salesforce login successful",
    #     "instance_url": token_data.get("instance_url"),
    #     "token_type": token_data.get("token_type"),
    #     "access_token": token_data.get("access_token")
    # }
    
    # Save token for our backend
    global salesforce_access_token
    global salesforce_instance_url

    salesforce_access_token = token_data.get("access_token")
    salesforce_instance_url = token_data.get("instance_url")

    return {
        "message": "Salesforce login successful"
    }