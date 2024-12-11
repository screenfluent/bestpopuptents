/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    debug?: {
      timestamp: string;
      path: string;
    };
  }
}
