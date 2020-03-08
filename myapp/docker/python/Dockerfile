# Dockerfile comments must be a '#' as the first character on the line
#
# FROM is the docker image we are building our image from
FROM python
# the path 'inside' the container
WORKDIR /usr/src/app
## 1st section - installs the package.json, requirements.txt, etc.
# COPY copies files into the container relative to the WORKDIR
#COPY package.json .
# RUN will execute a command in the container
## 2nd section - uses the paackage.json, requirements.txt
##               to install all needed modules 
#RUN npm install
## 3rd section - is the commands for networking
# EXPOSE will forward a port from the container to the host
#EXPOSE 8080
## 4th section - specifes the 'run' command of the container
# CMD will be the default command executed on a docker run of the container
#CMD [ "npm", "start" ]
## 5th section - copies the app's files into the container
#COPY . .
