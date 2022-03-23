FROM nginx:alpine 
COPY nginx.conf /etc/nginx/nginx.conf 
ADD dist/bug-tracking-ui /usr/share/nginx/html/app/ 
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]