FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
COPY ./binary.com.conf /etc/nginx/conf.d/default.conf
