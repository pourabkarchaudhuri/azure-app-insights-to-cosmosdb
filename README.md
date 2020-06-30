# Unity Azure Insights Analytics Function App 

This is an Azure function that triggers on PUT requests for files made to a path/container in azure blob storage and pulls out content of those files, parses them into minimalistic JSON and pushes to a NoSQL Azure Cosmos DB

## Deployment
Preferred an Azure Function running on Windows OS (Any region), and deployment via Visual Studio Code