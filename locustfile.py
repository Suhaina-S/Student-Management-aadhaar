from locust import HttpUser, task, between
import random
import base64

def getNumber():
    uid = ''
    for _ in range(10):
        uid += random.choice('7896541230')
    return uid
def getText():
    uid = ''
    for _ in range(50):
        uid += random.choice('qwertyuiopasdfghjklzxcvbnm')
    return uid

class BackendUser(HttpUser):
    wait_time = between(1, 3)

    @task(2)
    def signup(self):
        uid = getNumber()
        id = getText()
        payload = {
            "fullName": f"{id}{uid}",
            "username": f"{id}{uid}",
            "password": f"{id}{uid}",
            "accName": f"{id}{uid}",
            "accNo": f"{id}{uid}"
        }
        self.client.post("/signup", json=payload)

    @task(1)
    def login(self):
        payload = {
            "username": "a",   
            "password": "a"
        }
        self.client.post("/login", json=payload)

    @task(1)
    def send_mail(self):
        payload = {
    "from": "admin@aadhaar.com",
    "to": "akash@gmail.com",
    "subject": "Aadhaar verification OTP",
    "body": "Your OTP for aadhaar verification is 123456",
    "attachment": None
  }
        self.client.post("/mail/send", json=payload)

    @task(1)
    def send_image_mail(self):
        fake_img = base64.b64encode(b"fake_image_bytes").decode("utf-8")
        payload = {"from": "admin@aadhaar.com",
    "to": "akash@gmail.com",
    "subject": "E-Aadhaar Id",
    "body": "Download your Aadhaar Card",
    "attachment":{
      "filename":"aadhaar.jpg",
      "content":fake_img
    }}
        self.client.post("/mail/image", json=payload)

    @task(1)
    def check_reg(self):
        payload = { "regNumber": "a" }
        self.client.post("/student/check", json=payload)
    
    
    @task(1)
    def create_regg(self):
        payload = { "regNumber": "asxcv" }
        self.client.post("/student/check", json=payload)

    @task(1)
    def check_unique_id(self):
        payload = { "uniqueID": "7176212631141016" }
        self.client.post("/student/checkId", json=payload)

    # @task(1)
    # def create_or_update_student(self):
    #     payload = { "regNumber": str(random.randint(1000, 9999)) }
    #     self.client.post("/student/createOrUpdateStudent", json=payload)

    @task(1)
    def update_name(self):
        payload = {
            "regNumber": "asxcv",
            "nameDetails": {
      'firstName': "Demo",
      'middleName':"demo",
      'lastName':"demo",
      'father':"demo",
      'mother':"demo",
      'gender':"demo",
      'dob':"demo",
      'placeOfBirth':"demo",
      'nationality':"demo",
    }
        }
        self.client.post("/student/name", json=payload)

    @task(1)
    def update_address(self):
        payload = {
            "regNumber": "asxcv",
            "addressDetails":{'permanentAddress': "demo",
      'currentAddress': "demo",
      'district': "demo",
      'state': "demo",
      'country': "demo"}
        }
        self.client.post("/student/address", json=payload)

    # @task(1)
    # def get_students(self):
    #     self.client.get("/student/getAllStudents")

    # @task(1)
    # def get_student_details(self):
    #     self.client.get("/getStudentDetails/1234") 

    @task(1)
    def update_education(self):
        payload = {
            "regNumber": "asxcv",
            "educationDetails": {
                "collegeName": "PSG College of Technology",
                "yearOfJoining": "2023",
                "yearOfCompletion": "2027",
                "degree": "B.E.",
                "course": "Civil Engineering"
            }
        }
        self.client.post("/student/education", json=payload)
