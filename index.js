const express = require('express')
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");




const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "User API",
        description: "User API Information",
        contact: {
          name: "Developer"
        },
        servers: ["http://localhost:5000"]
      }
    },
    // ['.routes/*.js']
    apis: ["index.js"]
  };
  


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('',require('./Route/PaidListingApi'))
app.use('',require('./Route/AdminApi'))
app.use('',require('./Route/UserApi'))
app.use('',require('./Route/Category'))
app.use('',require('./Route/ListingApi'))
app.use('',require('./Route/ActivityApi'))
app.use('',require('./Route/ListingReport'))
app.use('',require('./Route/DraftApi'))
app.use('',require('./Route/InActiveApi'))
app.use('',require('./Route/ShippingApi'))
app.use('',require('./Route/ExclusiveCategoryApi'))
app.use('',require('./Route/ReportsApi'))
app.use('',require('./Route/FeatureData'))
app.use('',require('./Route/PaymentInfoApi'))
app.use('',require('./Route/IconApi'))
app.use('',require('./Route/OrderApi'))
app.use('',require('./Route/ORderSchemaApi'))
app.use('',require('./Route/ExclusiveUserApi'))
app.use('',require('./Route/ExclusiveServiceApi'))
app.use('',require('./Route/ExclusiveOrderApi'))
app.use('',require('./Route/ExclusiveMessegesApi'))
app.use('',require('./Route/JobBoard'))
app.use('',require('./Route/JobCategoryApi'))
app.use('',require('./Route/MessageApi'))
app.use('',require('./Route/HelpCenterApi'))
app.use('',require('./Route/BlogApi'))
app.use('',require('./Route/SponserApi'))
app.use('',require('./Route/AuctionItemsApi'))
app.use('',require('./Route/PayoutsApi'))

module.exports=app;

