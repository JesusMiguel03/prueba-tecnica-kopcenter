import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import useTheme from '@/src/hooks/useTheme';
import { useRef, useState } from 'react';
import { type TextInput, View, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type SignInFormProps = {
  onSubmit: (username: string, password: string) => Promise<void> | void;
  isLoading?: boolean;
  errors?: {
    username?: string | null;
    password?: string | null;
    general?: string | null;
  };
};

export function SignInForm({ onSubmit, isLoading, errors }: SignInFormProps) {
  const theme = useTheme();
  const passwordInputRef = useRef<TextInput>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function handleSubmit() {
    onSubmit(username.trim(), password.trim());
  }

  return (
    <View className="gap-6">
      <Card className="border-border shadow-sm shadow-black/5">
        <CardHeader>
          <CardTitle style={{ color: theme.primary }} className="text-4xl font-bold tracking-tight">
            🍑 DuraznoStore
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Inicia sesión para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Usuario</Label>
              <Input
                id="email"
                placeholder="usuario"
                autoCapitalize="none"
                onChangeText={setUsername}
                value={username}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                editable={!isLoading}
              />
              {errors?.username && (
                <Text style={{ color: 'red' }} className="text-xs">
                  {errors.username}
                </Text>
              )}
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
              </View>
              <View className="relative">
                <Input
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry={!showPassword}
                  placeholder="********"
                  onChangeText={setPassword}
                  value={password}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                  editable={!isLoading}
                  className="pr-10"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon
                    as={showPassword ? EyeOff : Eye}
                    size={20}
                    className="text-muted-foreground"
                  />
                </Pressable>
              </View>
              {errors?.password && (
                <Text style={{ color: 'red' }} className="text-xs">
                  {errors.password}
                </Text>
              )}
            </View>

            <Button className="w-full" onPress={handleSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Cargando...' : 'Continuar'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
