# WASTE MANAGEMENT SYSTEM

## About Us
- Team Name : `LAZY_CODERS`
- Member1 : `Ekramul Islam Shadik` - `shadik.sk420@gmail.com`
- Member2 :  `Abdul Kader Zilani Moududi` - `abdulkader225704@gmail.com`
- Member3 : `Iftekhar Md. Shishir` - `iftekharweb@gmail.com`

## Getting started

### Build a Docker file
```
docker-compose build
```




### To start project, run:
```
docker-compose up
```

The Frontend will then be available at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).
The Backend will then be available at [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin).
(Initially, the database is empty)
---

## Development Guide

### Load Initial Admin
#### 1.
```
docker-compose run --rm app sh -c "python manage.py initialize_roles"
```
#### 2.
```
docker-compose run --rm app sh -c "python manage.py superuser_init"
```
#### 3.
```
docker-compose run --rm app sh -c "python manage.py load_sts_data"
```
#### 4.
```
docker-compose run --rm app sh -c "python manage.py load_landfill_data"
```
(The first user will be created as Unassigned. You should change the role to System Admin by logging in to the "Django admin panel([http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin))". After this, you will see full control of the dashboard in frontend([http://127.0.0.1:8080/](http://127.0.0.1:8080/)))

### Username
```
admin2

```
### Password
```
admin2

```

