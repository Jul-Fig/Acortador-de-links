
db = db.getSiblingDB ('url-shortener');


db.createCollection ('urls', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['url', 'shortCode'],
      properties: {
        url: {
          bsonType: 'string',
          description: 'URL must be a string and is required'
        },
        shortCode: {
          bsonType: 'string',
          description: 'Short code must be a string and is required'
        },
        accessCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'Access count must be a non-negative integer'
        }
      }
    }
  }
});


db.urls.createIndex({ shortCode: 1 }, { unique: true });
db.urls.createIndex({ createdAt: 1 });
db.urls.createIndex({ accessCount: -1 });

print('Database initialized successfully');