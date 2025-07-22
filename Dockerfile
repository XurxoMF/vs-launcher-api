FROM node:22

RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

RUN apt-get update && \
    apt-get install -y innoextract && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME [ "/app/public" ]

VOLUME [ "/app/db" ]

EXPOSE 3000

CMD ["npm", "run", "start"]
