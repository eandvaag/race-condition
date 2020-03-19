FROM jackfirth/racket

WORKDIR /usr/src/app

#RUN mkdir -p /usr/share/racket/pkgs/htdp-lib
#COPY /usr/share/racket/pkgs/htdp-lib /usr/share/racket/pkgs/htdp-lib

RUN raco pkg install --batch --deps search-auto htdp-lib
