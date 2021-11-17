FROM node:14.17.5-alpine

ENV HOME=/home/node

USER node

RUN mkdir -p $HOME/app
WORKDIR $HOME/app

COPY --chown=node:node . $HOME/app

RUN yarn install && \
    yarn cache clean

ENTRYPOINT ["yarn"]
CMD ["run start"]

EXPOSE 3000