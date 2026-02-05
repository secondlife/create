---
title: Events
description: Event handling in SLua with LLEvents
---

## Introduction

SLua uses the `LLEvents` system to handle events from the Second Life simulator. Unlike traditional event handler declarations, SLua allows you to register event handlers dynamically using callback functions, giving you more flexibility in how you structure your code.

## Basic Event Registration

### Using `LLEvents:on()`

The primary way to register an event handler is with `LLEvents:on()`:

```luau
-- Register a touch_start event handler
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, `Touched by {detected[1]:getName()}`)
end)
```

The `on()` method takes two parameters:
- **Event name** (string): The name of the event (e.g., `"touch_start"`, `"listen"`)
- **Handler function**: A function that will be called when the event fires

### Handler Return Values

Event registration methods return a handler reference that you can use later to remove the handler:

```luau
local handler = LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Touched!")
end)

-- Later, remove the handler
LLEvents:off("touch_start", handler)
```

The `off()` method returns `true` if the handler was successfully removed, or `false` if it wasn't found.

## One-Time Event Handlers

Use `LLEvents:once()` to register a handler that automatically removes itself after running once:

```luau
-- This will only respond to the first touch
LLEvents:once("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "First touch detected!")
end)
```

This is useful for one-time initialization or waiting for a specific event to occur once.

## Event Parameter Patterns

Different events pass parameters in different ways:

### Non-Multi Events

Events like `listen` pass individual arguments directly to your handler:

```luau
LLEvents:on("listen", function(channel: number, name: string, id: string, msg: string)
    ll.Say(0, name .. " said: " .. msg)
end)
```

### Multi-Detection Events

Events like `touch_start`, `touch`, and `touch_end` receive a table of detected objects:

```luau
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    -- detected is a table (array) of DetectedEvent objects
    for i = 1, #detected do
        if detected[i].valid then
            ll.Say(0, `Touched by: {detected[i]:getName()}`)
        end
    end
end)
```

Each detected object has the properties:
- `valid` - Whether this object is still in scope of a detected handler.
- `index` - 0-based index of detected object, which can be used with ll.Detected\* family of functions. 
- `can_change_damage` - Whether this object was detected in a `damage` event and can change the damage its taking.

## Function Syntax Notes

### Declarative Event Handlers

You can define event handlers using declarative syntax:

```luau
function LLEvents.touch_start(detected)
    ll.Say(0, `Touched by {detected[1]:getName()}`)
end

function LLEvents.listen(channel, name, id, message)
    ll.Say(0, `{name} said: {message}`)
end
```

This declarative style creates a named function that automatically registers as an event handler.

## Advanced Features

### Callable Tables as Handlers

You can use tables with `__call` metamethods as event handlers:

```luau
local counter = {
    count = 0
}

setmetatable(counter, {
    __call = function(self, detected)
        self.count = self.count + 1
        ll.Say(0, "Touch count: " .. self.count)
    end
})

LLEvents:on("touch_start", counter)
```

When the event fires, the callable table receives `self` as its first parameter, allowing you to maintain state.

### Error Handling

Errors in event handlers are fatal and will terminate the script:

```luau
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    error("Something went wrong!")  -- This will crash the script
end)
```

To handle potential errors gracefully, use `pcall()`:

```luau
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    local success, err = pcall(function()
        -- Code that might error
        if math.random() > 0.5 then
            error("Random error!")
        end
        ll.Say(0, "Success!")
    end)

    if not success then
        ll.OwnerSay(`Error occurred: {err}`)
    end
end)
```

### Dynamic Handler Modification

You can add or remove handlers while an event is being processed:

**Adding handlers during events:**
- Handlers added during event triggering don't execute until the next event
- This prevents infinite loops

```luau
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    -- Add another handler during event processing
    LLEvents:on("touch_start", function(det)
        ll.Say(0, "New handler - won't run until next touch")
    end)
end)
```

**Removing handlers during events:**
- Removals take effect immediately for subsequent handlers in the same event
- The handler calling `off()` completes its execution

```luau
local handler2

local handler1 = LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Handler 1 - removing handler 2")
    LLEvents:off("touch_start", handler2)
end)

handler2 = LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Handler 2 - might not run if handler 1 removes me")
end)
```

## Multiple Handlers for the Same Event

You can register multiple handlers for the same event. They execute in the order they were registered:

```luau
-- First handler
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Handler 1")
end)

-- Second handler
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Handler 2")
end)

-- Third handler
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Handler 3")
end)

-- When touched, you'll see:
-- "Handler 1"
-- "Handler 2"
-- "Handler 3"
```

## Common Event Examples

### Touch Events

```luau
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, `Touch started by {detected[1]:getName()}`)
end)

LLEvents:on("touch", function(detected: {DetectedEvent})
    ll.Say(0, "Touching...")
end)

LLEvents:on("touch_end", function(detected: {DetectedEvent})
    ll.Say(0, "Touch ended")
end)
```

### Listen Events

```luau
-- First, set up a listener
ll.Listen(0, "", NULL_KEY, "")

-- Then handle the messages
LLEvents:on("listen", function(channel: number, name: string, id: string, message: string)
    ll.Say(0, `{name} said on channel {channel}: {message}`)
end)
```

### Collision Events

```luau
LLEvents:on("collision_start", function(detected: {DetectedEvent})
    ll.Say(0, `Collision with {detected[1]:getName()}`)
end)

LLEvents:on("collision", function(detected: {DetectedEvent})
    ll.Say(0, "Colliding...")
end)

LLEvents:on("collision_end", function(detected: {DetectedEvent})
    ll.Say(0, "Collision ended")
end)
```

## Practical Patterns

### State-Based Event Handling

You can simulate states by swapping handler functions:

```luau
local function idleHandler(detected: {DetectedEvent})
    ll.Say(0, "Switching to active state")
    LLEvents:off("touch_start", idleHandler)
    LLEvents:on("touch_start", activeHandler)
end

local function activeHandler(detected: {DetectedEvent})
    ll.Say(0, "Switching to idle state")
    LLEvents:off("touch_start", activeHandler)
    LLEvents:on("touch_start", idleHandler)
end

-- Start in idle state
LLEvents:on("touch_start", idleHandler)
```

### Conditional Event Handling

```luau
local enabled = true

LLEvents:on("touch_start", function(detected: {DetectedEvent})
    if not enabled then
        return
    end

    ll.Say(0, "Event is enabled")
end)

-- Later, disable without removing the handler
enabled = false
```

### Event Handler Cleanup

```luau
local handlers = {}

-- Register multiple handlers and keep track of them
handlers.touch = LLEvents:on("touch_start", function(detected: {DetectedEvent})
    ll.Say(0, "Touched!")
end)

handlers.listen = LLEvents:on("listen", function(channel: number, name: string, id: string, msg: string)
    ll.Say(0, "Heard: " .. msg)
end)

-- Later, clean up all handlers
for event, handler in pairs(handlers) do
    LLEvents:off(event, handler)
end
```

## Best Practices

1. **Keep handlers focused**: Each handler should do one thing well
2. **Avoid heavy processing**: Event handlers should complete quickly
3. **Use meaningful names**: When storing handler references, use descriptive variable names
4. **Clean up when done**: Remove handlers you no longer need with `off()`
5. **Handle errors gracefully**: Use `pcall()` in handlers that might fail
6. **Consider order**: Remember that handlers execute in registration order

## Common Pitfalls

### Handler Never Runs

If your handler doesn't seem to run:
- Check that you've registered it with the correct event name
- Ensure the event is actually being triggered (e.g., `ll.Listen()` for listen events)
- Verify that you didn't accidentally remove it with `off()`

### Infinite Loops

Be careful when triggering events from within handlers. This is particularly true for `link_message` events, but not for `listen` events since objects cannot hear themselves:

```luau
-- ✗ This causes an infinite loop with link_message
LLEvents:on("link_message", function(sender: number, num: number, str: string, id: string)
    ll.MessageLinked(LINK_THIS, 0, "response", "")  -- Triggers another link_message!
end)

-- ✓ This is safe - objects can't hear their own chat
LLEvents:on("listen", function(channel: number, name: string, id: string, msg: string)
    ll.Say(0, msg)  -- Won't trigger this handler again
end)
```

### Memory Leaks

Remove handlers you no longer need:
```luau
-- ✗ Creating new handlers repeatedly without cleanup
LLEvents:on("touch_start", function(detected: {DetectedEvent})
    -- This creates a new listen handler on each touch!
    LLEvents:on("listen", function(channel, name, id, msg)
        ll.Say(0, `Heard: {msg}`)
    end)
end)

-- ✓ Store and reuse or remove handlers
local listenHandler = LLEvents:on("listen", function(channel, name, id, msg)
    ll.Say(0, `Heard: {msg}`)
end)
```

*This guide covers the LLEvents system for event handling in SLua. For timer management, see the [Timers](./timers/) documentation.*
