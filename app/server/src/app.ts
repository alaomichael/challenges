import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './docs/openai';
import supplierRouter from './routes/supplier.routes';
import productRouter from './routes/product.routes';
import inventoryRouter from './routes/inventory.routes';
import logger from "./middlewares/logger";
import errorHandler from "./helper/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI & OpenAPI JSON
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get('/openapi.json', (req, res) => res.json(openApiDocument));

// API Routes
app.use('/api/suppliers', supplierRouter);
app.use('/api/products', productRouter);
app.use('/api/inventory', inventoryRouter);

app.use('/health', (req,res) =>
{
    res.status(200).json({
        success: true,
message:"Server is healthy."
    })
})
// Register errorHandler after my routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

export default app;
