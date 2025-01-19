import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 bg-white rounded shadow-md">
        <CardContent>
          <h1 className="mb-4 text-4xl font-bold text-center">404 Not Found</h1>
          <p className="mb-4 text-center text-gray-600">
            The page you are looking for does not exist.
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <Button color="primary" size="lg">
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;