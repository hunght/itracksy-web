'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SettingsIcon, Volume2 } from 'lucide-react';

import { useAtom } from 'jotai';
import { fontAtom, speedAtom, themeAtom } from '@/state/fastReadSettings';
import { useState } from 'react';

interface ReadingSettingDialogProps { }

export function ReadingSettingDialog({ }: ReadingSettingDialogProps) {
  const [speed, setSpeed] = useAtom(speedAtom);
  const [font, setFont] = useAtom(fontAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [isOpen, setIsOpen] = useState(false);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reading Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="speed">Reading Speed (words per minute)</Label>
            <Slider
              id="speed"
              min={100}
              max={500}
              step={10}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
            />
            <div className="text-center text-sm text-muted-foreground">
              {speed} wpm
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="font">Font</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger id="font">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="grid gap-2">
            <Label>Color Theme</Label>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sepia" id="sepia" />
                <Label htmlFor="sepia">Sepia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
            </RadioGroup>
          </div> */}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
