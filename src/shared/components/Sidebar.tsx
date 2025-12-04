import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../modules/auth';
import { colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Ícones SVG como componentes React Native
const DashboardIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>📊</Text>
  </View>
);

const CheckInIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>✓</Text>
  </View>
);

const DumbbellIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>🏋️</Text>
  </View>
);

const AppleIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>🍎</Text>
  </View>
);

const SupplementIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>💊</Text>
  </View>
);

const ActivityIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>📈</Text>
  </View>
);

const RecoveryIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>🔄</Text>
  </View>
);

const PasswordIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>🔒</Text>
  </View>
);

const LogoutIcon = ({ color = colors.textSecondary }: { color?: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color, fontSize: 16 }}>🚪</Text>
  </View>
);

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/(tabs)',
    icon: <DashboardIcon />,
  },
  {
    label: 'Check-ins',
    href: '/(tabs)/checkins',
    icon: <CheckInIcon />,
  },
  {
    label: 'Treinos',
    href: '/(tabs)/training',
    icon: <DumbbellIcon />,
  },
  {
    label: 'Dieta',
    href: '/(tabs)/diet',
    icon: <AppleIcon />,
  },
  {
    label: 'Suplementos',
    href: '/(tabs)/supplements',
    icon: <SupplementIcon />,
  },
  {
    label: 'Atividade',
    href: '/(tabs)/activity',
    icon: <ActivityIcon />,
  },
  {
    label: 'Recuperação',
    href: '/(tabs)/recovery',
    icon: <RecoveryIcon />,
  },
  {
    label: 'Senha',
    href: '/(tabs)/change-password',
    icon: <PasswordIcon />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [slideAnim] = React.useState(new Animated.Value(-SIDEBAR_WIDTH));

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    router.push(href as any);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
    onClose();
  };

  const isActive = (href: string) => {
    if (href === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    return pathname === href || pathname?.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.sidebarContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/BODY FORGE ICON SVG.svg')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>BODY FORGE</Text>
                <Text style={styles.tagline}>COACH E ALUNO, UNIDOS PELA EVOLUÇÃO</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <TouchableOpacity
                  key={item.href}
                  style={[styles.navItem, active && styles.navItemActive]}
                  onPress={() => handleNavigate(item.href)}
                >
                  <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                    {React.cloneElement(item.icon as React.ReactElement, {
                      color: active ? colors.accent : colors.textMuted,
                    })}
                  </View>
                  <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                    {item.label}
                  </Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogoutIcon color={colors.textSecondary} />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.surface,
    zIndex: 1000,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTextContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  navContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: colors.background,
  },
  navItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navItemTextActive: {
    color: colors.background,
  },
  arrow: {
    fontSize: 20,
    color: colors.textMuted,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

