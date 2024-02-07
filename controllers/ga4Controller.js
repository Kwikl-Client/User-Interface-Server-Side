export const ga4=async()=>{
    const ga4EventData = req.body; 
  try {
    const database = client.db('your-database');
    const collection = database.collection('ga4-events');

    await collection.insertOne(ga4EventData);
    res.status(200).send('GA4 Event tracked and stored.');
  } catch (error) {
    console.error('Error storing GA4 event in MongoDB', error);
    res.status(500).send('Internal Server Error');
  }
}