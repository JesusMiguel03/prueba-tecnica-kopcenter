import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@color_scheme';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

export default function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleToggle = async () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  };

  return (
    <Button
      onPressIn={handleToggle}
      size="icon"
      variant="ghost"
      className="ml-4 h-10 w-10 rounded-full bg-secondary/50 hover:bg-secondary">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5 text-foreground" />
    </Button>
  );
}
