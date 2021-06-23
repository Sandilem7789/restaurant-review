exports = async function(payload, response) {

  if (payload.body) {
    //EJSON is just JSON with a few more data-types
      const body =  EJSON.parse(payload.body.text());
      const reviews = context.services.get("mongodb-atlas").db("sample_restaurants").collection("reviews");
      
      const reviewDoc = {
          name: body.name,
          user_id: body.user_id,
          date: new Date(),
          text: body.text,
          restaurant_id: BSON.ObjectId(body.restaurant_id)      //changing the resturand id into an object id
      };
  
      return await reviews.insertOne(reviewDoc);
  }

  return  {};
};