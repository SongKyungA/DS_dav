import os
from firebase_admin import credentials, initialize_app, storage, firestore
import re

# Firebase Admin SDK 초기화
cred = credentials.Certificate('./serviceAccountKey.json')
initialize_app(cred, {'storageBucket': 'dav-project-b0edb.appspot.com'})

# Firestore 초기화
db = firestore.client()

# Firebase Storage 버킷 이름
bucket_name = 'dav-project-b0edb.appspot.com'  # Firebase Console에서 확인 가능

# Firestore 컬렉션 및 문서
collection_name = 'food' 

# Firebase Storage에서 이미지 정보 가져오기
def get_images_info():
    images_info = []

    # Firebase Storage에서 모든 파일 정보 가져오기
    blobs = storage.bucket(bucket_name).list_blobs()

    for blob in blobs:
        print(blob.name.split('.')[0])
        image_info = {'name': blob.name.split('.')[0], 'url': blob.public_url}
        images_info.append(image_info)

    return images_info

# Firestore에 이미지 정보 저장
def save_images_to_firestore(images_info):
    food_doc_ref = db.collection(collection_name)

    for image_info in images_info:

        image_name = image_info['name']
        image_name = re.sub(r'-', ' ', image_name)
        image_url = image_info['url']
        print("name: ", image_name, "url: ", image_url)

        # Firestore 문서 업데이트 또는 추가
        food_doc_ref.document(image_name).set({
            'url': image_url
        }, merge=True)

        print(f'Image {image_name} updated in Firestore')

if __name__ == "__main__":
    # Firebase Storage에서 이미지 정보 가져오기
    images_info = get_images_info()

    # Firestore에 이미지 정보 저장
    save_images_to_firestore(images_info)
