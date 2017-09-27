# hn-clone

![alt text](https://photos-4.dropbox.com/t/2/AADxxzdJcLmjnDfpYdI-EKYSYPW3CHweDLxU2RRFhjsQSQ/12/15837792/png/32x32/1/_/1/2/Screenshot%202017-09-27%2022.31.16.png/ENHm5QsY8qtBIAcoBw/9LAwB2oiLl9-MFJNqAAhmUcqAbcEcnvJFfFvoPmjdcw?size=2048x1536&size_mode=3)

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

