
'use strict';

const fs = require('fs');
const name = 'coda';
const description = 'All the services for the new Web API';
const pathRoutesFiles = require('../api-microservice-coda/src/api/routes/generated');


let jsonPostman = {
  info: {
    name: name,
    description: description,
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: [],
  event: []
};
let itemsAux = {};
let keys = Object.keys(pathRoutesFiles);
keys.forEach(key => {
  let [method, route] = key.split(' ');
  let name = route.replace(/\/([a-z\-1-9]+)(\/\:ID)?/, '$1');
  itemsAux[name] = itemsAux[name] || { name, item: [] };
  let isList = '';
  let query = [];
  let variable = [];
  let body = {};

  switch (true) {
    case method === 'GET' && !route.match(/\/\:ID$/):
      isList = 'list ';
      query = [
        {
          key: 'q',
          value: '',
          description: 'global search'
        },
        {
          key: 'offset',
          value: '20',
          description: 'the page field is mandatory if send both, this will be discarted'
        },
        {
          key: 'page',
          value: '1'
        },
        {
          key: 'limit',
          value: '20'
        },
        {
          key: 'q.<column-name>',
          value: 'any',
          description: 'Replace <column-name> for any name of column you need'
        }
      ];
      break;
    case method === 'POST':
    case method === 'PATCH':
      body = { mode: 'raw', raw: '' };
    case method === 'POST':
      break;
    default:
      variable = [
        {
          key: 'ID',
          value: '1'
        }
      ]
      break;
  }

  itemsAux[name].item.push({
    name: `${method.toLowerCase()} ${isList}${name}`,
    request: {
      method,
      header: [
        {
          key: 'x-access-token',
          type: 'text',
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTQyMzE0NjY1LCJleHAiOjE1NDI0MDEwNjV9.bkXc5HdX11sJL7jq-g0sUltlAxW9Rjdm404_QqUGym0'
        },
        {
          key: 'Content-Type',
          name: 'Content-Type',
          type: 'text',
          value: 'application/json'
        }
      ],
      url: {
        raw: 'http://localhost:4000' + route,
        protocol: 'http',
        host: [
          'localhost'
        ],
        port: '4000',
        path: route.split('/').map(p => p ? p : undefined),
        variable,
        query
      },
      body
    }
  });
});

let routes = Object.keys(itemsAux).map(k => {
  itemsAux[k].item.sort((a, b) => a.name > b.name);
  return itemsAux[k];
});
jsonPostman.item = routes;

fs.writeFileSync('postman.json', JSON.stringify(jsonPostman, null, 2));

