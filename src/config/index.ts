import dotenv from 'dotenv';
import { connect } from 'http2';
import path from 'path';
dotenv.config({
    path: path.join(process.cwd(), '.env')
});
export const config = {
    port: process.env.PORT || 3000,
    connectionString: process.env.connectionString || '',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || ''
}
