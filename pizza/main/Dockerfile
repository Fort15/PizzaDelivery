FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY /PizzaDelivery/pizza/main/templates/main/index.html /usr/share/nginx/html/
COPY /PizzaDelivery/pizza/main/static/main/css/ /usr/share/nginx/html/css/
COPY /PizzaDelivery/pizza/main/static/main/js/ /usr/share/nginx/html/js/
COPY /PizzaDelivery/pizza/main/static/main/img/ /usr/share/nginx/html/img/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
