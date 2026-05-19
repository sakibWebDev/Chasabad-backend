import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/admin";

const bootstrap = async () => {
    try {
         await seedSuperAdmin();
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
            console.log(`Press CTRL + C to stop the server`, envVars.PORT,  envVars.NODE_ENV, envVars.DATABASE_URL);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();