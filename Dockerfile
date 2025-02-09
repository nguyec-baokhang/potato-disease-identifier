# Start with the base image
FROM python:3.10.12

# Changing working dir into code
WORKDIR /code 

# Copy the requiremtns file to image
COPY ./requirements.txt /code/requirements.txt

# Install listed python libs
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Append project and data dirs to PYTHON PATH 
ENV PYTHONPATH "${PYTHONPATH}:/code/api/"

# Add code inside api into the image
COPY ./api/ /code/api

# Run the defaut commands
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]