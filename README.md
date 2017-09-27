# hn-clone

![alt text](https://www.dropbox.com/s/0g29503vnt9aqyg/Screenshot%202017-09-27%2022.31.16.png)

Query This EP
https://6wbi17ege4.execute-api.us-east-1.amazonaws.com/dev/graphql


### Example Query 
```
query {
  author(userId: "f8f2f266-cfb4-45b5-8db9-ca9d4b5891ba") {
    userId
    name
    links {
      title
      linkId
      author {
        userId
        name
        links {
          linkId
          title
          author {
            name
            userId
          }
        }
      }
    }
  }
}
```

