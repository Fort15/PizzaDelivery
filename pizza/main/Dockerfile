FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*

COPY pizza/main/nginx.conf /etc/nginx/conf.d/default.conf

COPY pizza/main/templates/main/index.html /usr/share/nginx/html/
COPY pizza/main/static/main/css/ /usr/share/nginx/html/css/
COPY pizza/main/static/main/js/ /usr/share/nginx/html/js/
COPY pizza/main/static/main/img/ /usr/share/nginx/html/img/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
