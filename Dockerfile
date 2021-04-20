FROM 10.0.0.8:5000/nginx:v1.2

COPY nginx.conf /usr/local/nginx/conf.d/nginx.conf

COPY dist /data/src

#懿轩授权文件
COPY MP_verify_kDj0SzHlAOKWbNbr.txt /data/src/MP_verify_kDj0SzHlAOKWbNbr.txt

#智轩授权文件
COPY MP_verify_BaKjjDBEp5nIRNL4.txt /data/src/MP_verify_BaKjjDBEp5nIRNL4.txt

RUN chown -R www-data.www-data /data/src/ && chmod -R 755 /data/src

EXPOSE 80


