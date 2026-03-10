import { useAuth } from '@/src/hooks/useAuth';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { LogOutIcon } from 'lucide-react-native';

export default function SignOut() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button variant="ghost" onPress={handleLogout}>
      <Icon as={LogOutIcon} className="size-5" />
    </Button>
  );
}
