import requests
import auth


API_VERSION = "v66.0"


# -------------------------------------------------
# Salesforce headers
# -------------------------------------------------

def get_headers():
    return {
        "Authorization": f"Bearer {auth.salesforce_access_token}",
        "Content-Type": "application/json"
    }


# -------------------------------------------------
# Check Salesforce Login
# -------------------------------------------------

def check_login():

    if not auth.salesforce_access_token:
        return False

    if not auth.salesforce_instance_url:
        return False

    return True


# -------------------------------------------------
# Allowed Salesforce Objects
# -------------------------------------------------

ALLOWED_OBJECTS = {
    "Account",
    "Opportunity",
    "Lead",
    "Contact",
    "Case"
}


def check_object(object_name):

    if object_name not in ALLOWED_OBJECTS:
        return False

    return True


# -------------------------------------------------
# GET RECORDS
# -------------------------------------------------

def get_records(object_name, limit=20, offset=0):

    if not check_login():
        return {
            "error": "Not logged in to Salesforce. Please login first."
        }

    if not check_object(object_name):
        return {
            "error": "Invalid Salesforce object."
        }

    url = (
        f"{auth.salesforce_instance_url}"
        f"/services/data/{API_VERSION}/query"
    )

    # Fields for each object
    fields = {

        "Account": [
            "Id",
            "Name",
            "Phone",
            "Industry",
            "Website"
        ],

        "Opportunity": [
            "Id",
            "Name",
            "Amount",
            "StageName",
            "CloseDate"
        ],

        "Lead": [
            "Id",
            "FirstName",
            "LastName",
            "Company",
            "Email"
        ],

        "Contact": [
            "Id",
            "FirstName",
            "LastName",
            "Email",
            "Phone"
        ],

        "Case": [
            "Id",
            "CaseNumber",
            "Subject",
            "Status",
            "Priority"
        ]
    }

    selected_fields = ", ".join(fields[object_name])

    query = (
        f"SELECT {selected_fields} "
        f"FROM {object_name} "
        f"LIMIT {limit} "
        f"OFFSET {offset}"
    )

    try:

        response = requests.get(
            url,
            headers=get_headers(),
            params={
                "q": query
            },
            timeout=10
        )

        return {
            "status_code": response.status_code,
            "object": object_name,
            "limit": limit,
            "offset": offset,
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:

        return {
            "error": str(e)
        }


# -------------------------------------------------
# CREATE RECORD
# -------------------------------------------------

def create_record(object_name, record_data):

    if not check_login():
        return {
            "error": "Not logged in to Salesforce."
        }

    if not check_object(object_name):
        return {
            "error": "Invalid Salesforce object."
        }

    url = (
        f"{auth.salesforce_instance_url}"
        f"/services/data/{API_VERSION}/sobjects/"
        f"{object_name}/"
    )

    try:

        response = requests.post(
            url,
            headers=get_headers(),
            json=record_data,
            timeout=10
        )

        return {
            "status_code": response.status_code,
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:

        return {
            "error": str(e)
        }


# -------------------------------------------------
# UPDATE RECORD
# -------------------------------------------------

def update_record(object_name, record_id, record_data):

    if not check_login():
        return {
            "error": "Not logged in to Salesforce."
        }

    if not check_object(object_name):
        return {
            "error": "Invalid Salesforce object."
        }

    url = (
        f"{auth.salesforce_instance_url}"
        f"/services/data/{API_VERSION}/sobjects/"
        f"{object_name}/{record_id}"
    )

    try:

        response = requests.patch(
            url,
            headers=get_headers(),
            json=record_data,
            timeout=10
        )

        if response.status_code == 204:

            return {
                "status_code": 204,
                "message": "Record updated successfully"
            }

        return {
            "status_code": response.status_code,
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:

        return {
            "error": str(e)
        }


# -------------------------------------------------
# DELETE RECORD
# -------------------------------------------------

def delete_record(object_name, record_id):

    if not check_login():
        return {
            "error": "Not logged in to Salesforce."
        }

    if not check_object(object_name):
        return {
            "error": "Invalid Salesforce object."
        }

    url = (
        f"{auth.salesforce_instance_url}"
        f"/services/data/{API_VERSION}/sobjects/"
        f"{object_name}/{record_id}"
    )

    try:

        response = requests.delete(
            url,
            headers=get_headers(),
            timeout=10
        )

        if response.status_code == 204:

            return {
                "status_code": 204,
                "message": "Record deleted successfully"
            }

        return {
            "status_code": response.status_code,
            "data": response.text
        }

    except requests.exceptions.RequestException as e:

        return {
            "error": str(e)
        }