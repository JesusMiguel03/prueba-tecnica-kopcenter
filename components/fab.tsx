import { Pressable, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

type FABVariant = 'primary' | 'secondary' | 'destructive' | 'outline';

import type { LucideIcon } from 'lucide-react-native';

interface FABProps {
  onPress: () => void;
  icon?: LucideIcon;
  label?: string;
  variant?: FABVariant;
  extended?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<FABVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'bg-background border-2 border-border',
};

const iconColor: Record<FABVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
};

export function FAB({
  onPress,
  icon: IconComponent = Plus,
  label,
  variant = 'primary',
  extended = false,
  disabled = false,
}: FABProps) {
  return (
    <View className="absolute bottom-6 right-6">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`h-10 flex-row items-center justify-center gap-2 rounded-full shadow-sm ${extended ? 'px-4' : 'w-10'} ${variantStyles[variant]} ${disabled ? 'opacity-50' : 'active:opacity-80'} `}>
        <Icon as={IconComponent} size={18} className={iconColor[variant]} />
        {extended && label && (
          <Text className={`font-semibold ${iconColor[variant]}`}>{label}</Text>
        )}
      </Pressable>
    </View>
  );
}
