#!/usr/bin/env node
import { installComponent } from './install-component.mjs'

installComponent().catch((error) => {
  console.error('Error during component installation:', error)
  process.exit(1)
})
