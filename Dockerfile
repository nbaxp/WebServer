FROM node:16
RUN npm i rollup -g
CMD rollup -v