import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-masuma-red">
            Masuma Autoparts
          </CardTitle>
          <CardDescription>
            Sign in to access your inventory management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--masuma-red))',
                    brandAccent: 'hsl(var(--masuma-red-dark))',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'hsl(var(--background))',
                    defaultButtonBackgroundHover: 'hsl(var(--muted))',
                    inputBackground: 'hsl(var(--background))',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderHover: 'hsl(var(--masuma-red))',
                    inputBorderFocus: 'hsl(var(--masuma-red))',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}