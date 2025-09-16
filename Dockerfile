FROM node:24

RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

RUN dpkg --add-architecture i386

RUN apt-get update && apt-get install -y \
    wine \
    wine32:i386

ENV DISPLAY=:99
ENV WINEPREFIX=/root/.wine
ENV WINEDLLOVERRIDES="mscoree,mshtml="

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /app/libs/innounp.exe || echo "There is no innounp.exe on the libs folder!"

VOLUME [ "/app/public" ]

VOLUME [ "/app/db" ]

EXPOSE 3000

CMD ["npm", "run", "start"]
