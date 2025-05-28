FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY Public/html/ /usr/share/nginx/html/
COPY Public/css/ /usr/share/nginx/html/css/
COPY Public/js/ /usr/share/nginx/html/js/
COPY Public/img/ /usr/share/nginx/html/img/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]