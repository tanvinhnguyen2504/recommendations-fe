import { useState } from 'react';
import { LogOut, MoreHorizontal, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const THEMES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

type Theme = (typeof THEMES)[number]['value'];

export function Showcase() {
  const [theme, setTheme] = useState<Theme>('system');
  const [note, setNote] = useState('');

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 p-4 pb-24 md:p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Core components</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Security">
            <Shield />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
                <Avatar className="size-7">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  toast.success('Signed out');
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Section title="ToggleGroup — theme">
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(next) => {
            if (next !== '') {
              setTheme(next as Theme);
            }
          }}
          className="w-full justify-start overflow-x-auto"
        >
          {THEMES.map((item) => {
            return (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className="shrink-0 whitespace-nowrap"
              >
                {item.label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </Section>

      <Section title="Textarea + Input + Label">
        <div className="space-y-1.5">
          <Label htmlFor="display-name">Display name</Label>
          <Input id="display-name" placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
            }}
            placeholder="A note about this account…"
            rows={4}
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck
          />
          <p className="text-muted-foreground text-xs">{note.length} / 280</p>
        </div>
      </Section>

      <Section title="Select">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="vi">
              <SelectTrigger id="language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="vi">Vietnamese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="session">Session length</Label>
            <Select defaultValue="30d">
              <SelectTrigger id="session" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Tabs + Card + Skeleton">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Profile details come from Google at sign-in.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sessions" className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              toast.success('Saved');
            }}
          >
            Save changes
          </Button>
          <Button variant="outline">Sign in with Google</Button>
          <Button variant="secondary">Refresh session</Button>
          <Button variant="ghost">
            <MoreHorizontal />
            More
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.error('Your session has expired');
            }}
          >
            <LogOut />
            Sign out
          </Button>
          <Button disabled>Working…</Button>
        </div>
      </Section>

      <Section title="Dialog (desktop) / Drawer (bottom sheet)">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Sign out — Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign out?</DialogTitle>
                <DialogDescription>
                  You will need to sign in with Google again on this device.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.success('Signed out');
                    }}
                  >
                    Sign out
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Options — Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Options</DrawerTitle>
                <DrawerDescription>Theme and language.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </Section>

      <Toaster />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</h2>
      {children}
    </section>
  );
}
