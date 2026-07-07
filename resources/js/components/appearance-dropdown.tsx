import { useAppearance } from '@/hooks/use-appearance';
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/catalyst/dropdown';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <MoonIcon />;
            case 'light':
                return <SunIcon />;
            default:
                return <ComputerDesktopIcon />;
        }
    };

    return (
        <div className={className} {...props}>
            <Dropdown>
                <DropdownButton plain aria-label="Toggle theme">
                    {getCurrentIcon()}
                </DropdownButton>
                <DropdownMenu anchor="bottom end">
                    <DropdownItem onClick={() => updateAppearance('light')}>
                        <SunIcon />
                        <DropdownLabel>Light</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem onClick={() => updateAppearance('dark')}>
                        <MoonIcon />
                        <DropdownLabel>Dark</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem onClick={() => updateAppearance('system')}>
                        <ComputerDesktopIcon />
                        <DropdownLabel>System</DropdownLabel>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
