import { Injectable } from '@nestjs/common';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { Event } from './entities/event.entity';

@Injectable()
export class EventRepository {
  private readonly filePath = join(
    process.cwd(),
    'resources',
    'data',
    'events.json',
  );

  constructor() {
    this.ensureStorage();
  }

  find(): Promise<Event[]> {
    return Promise.resolve(this.readAll());
  }

  findOne(id: string): Promise<Event | undefined> {
    return Promise.resolve(this.readAll().find((event) => event.id === id));
  }

  save(event: Event): Promise<Event> {
    const events = this.readAll();
    const index = events.findIndex((item) => item.id === event.id);

    if (index >= 0) {
      events[index] = event;
    } else {
      events.push(event);
    }

    this.persist(events);
    return Promise.resolve(event);
  }

  delete(id: string): Promise<boolean> {
    const events = this.readAll();
    const filteredEvents = events.filter((event) => event.id !== id);

    if (filteredEvents.length === events.length) {
      return Promise.resolve(false);
    }

    this.persist(filteredEvents);
    return Promise.resolve(true);
  }

  private ensureStorage(): void {
    const directory = dirname(this.filePath);

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  private readAll(): Event[] {
    const rawContent = readFileSync(this.filePath, 'utf-8');
    return JSON.parse(rawContent) as Event[];
  }

  private persist(events: Event[]): void {
    writeFileSync(this.filePath, JSON.stringify(events, null, 2), 'utf-8');
  }
}
