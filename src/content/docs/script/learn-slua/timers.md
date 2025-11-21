---
title: Timers
description: Timer management in SLua with LLTimers
---

## Introduction

SLua provides the `LLTimers` system for managing timers in your scripts. Unlike LSL's single global timer, `LLTimers` allows you to create multiple independent timers with different intervals and callbacks, giving you precise control over scheduled execution.

## Creating Timers

### Recurring Timers with `every()`

Create a timer that fires repeatedly at a specified interval:

```lua
local handler = LLTimers:every(0.1, function(scheduled_time, interval)
    ll.Say(0, "Timer fires every 0.1 seconds")
end)
```

The `every()` method takes two parameters:
- **Interval** (number): Time in seconds between timer fires
- **Callback function**: Function called each time the timer fires

### One-Time Timers with `once()`

Create a timer that fires only once after a delay:

```lua
local handler = LLTimers:once(2.0, function(scheduled_time)
    ll.Say(0, "This fires once after 2 seconds")
end)
```

One-time timers automatically remove themselves after firing. Note that the `interval` parameter is not passed to `once()` callbacks since they only fire once.

## Stopping Timers

All timer creation methods return a handler reference that you can use to stop the timer:

```lua
local handler = LLTimers:every(1.0, function()
    ll.Say(0, "Tick")
end)

-- Later, stop the timer
local success = LLTimers:off(handler)
```

The `off()` method returns:
- `true` if the timer was found and removed
- `false` if the timer wasn't found (already removed or never existed)

## Timer Callback Parameters

Timer callbacks receive two parameters:

```lua
LLTimers:every(1.0, function(scheduled_time, interval)
    local current_time = os.clock()
    local delay = current_time - scheduled_time

    ll.Say(0, "Scheduled: " .. scheduled_time)
    ll.Say(0, "Interval: " .. interval)
    ll.Say(0, "Actual delay: " .. delay)
end)
```

- **scheduled_time** (number): The time when the timer was logically scheduled to fire
- **interval** (number or nil): The timer interval (for recurring timers), or `nil` for one-time timers

The `scheduled_time` parameter lets you detect if your timer is running late by comparing it to the current time.

## Timer Intervals

### Normal Intervals

Any positive number specifies the interval in seconds:

```lua
LLTimers:every(0.1, callback)   -- 100 milliseconds
LLTimers:every(1.0, callback)   -- 1 second
LLTimers:every(5.5, callback)   -- 5.5 seconds
```

### Zero Interval (Immediate Execution)

An interval of `0` creates a timer that fires as soon as possible:

```lua
LLTimers:every(0, function()
    ll.Say(0, "Fires immediately on next tick")
end)
```

This is useful for deferring execution to the next frame while avoiding unnecessary delays.

## Advanced Features

### Callable Tables as Handlers

Like `LLEvents`, you can use tables with `__call` metamethods as timer callbacks:

```lua
local counter = {
    count = 0
}

setmetatable(counter, {
    __call = function(self, scheduled_time, interval)
        self.count = self.count + 1
        ll.Say(0, "Timer fired " .. self.count .. " times")
    end
})

LLTimers:every(1.0, counter)
```

### Removing Timers from Within Callbacks

Timers can remove themselves or other timers during execution:

```lua
local handler

handler = LLTimers:every(1.0, function()
    ll.Say(0, "Firing once, then stopping")
    LLTimers:off(handler)
end)
```

You can also modify other timers:

```lua
local timer1, timer2

timer1 = LLTimers:every(1.0, function()
    ll.Say(0, "Timer 1 stopping timer 2")
    LLTimers:off(timer2)
end)

timer2 = LLTimers:every(0.5, function()
    ll.Say(0, "Timer 2 tick")
end)
```

### Yielding to the Simulator

Timer callbacks can use `coroutine.yield()` to yield execution back to the simulator:

```lua
LLTimers:every(1.0, function()
    ll.Say(0, "Starting")
    coroutine.yield()  -- Yields to simulator, resumes on next frame
    ll.Say(0, "Continued on next frame")
end)
```

This yields control back to the simulator and resumes on the next server frame, not at some arbitrary later time.

### Catch-Up Behavior

If a timer is delayed by more than 2 seconds (e.g., due to script lag), it fires only once per tick instead of rapidly catching up:

```lua
-- If this timer is delayed by 10 seconds, it won't fire 100 times rapidly
-- Instead, it fires once and resumes normal scheduling
LLTimers:every(0.1, function()
    ll.Say(0, "Protected from catch-up spam")
end)
```

This prevents timer callbacks from overwhelming your script after a lag spike.

## Multiple Timers

You can create as many timers as you need, each with different intervals:

```lua
-- Fast update for smooth animations
LLTimers:every(0.05, function()
    -- Update animation frame
end)

-- Medium update for game logic
LLTimers:every(0.5, function()
    -- Check game state
end)

-- Slow update for housekeeping
LLTimers:every(5.0, function()
    -- Clean up old data
end)

-- One-time delayed action
LLTimers:once(10.0, function()
    -- Do something after 10 seconds
end)
```

All timers run independently and maintain their own schedules.

## Practical Examples

### Countdown Timer

```lua
local count = 10

local countdown = LLTimers:every(1.0, function()
    ll.Say(0, tostring(count))
    count = count - 1

    if count <= 0 then
        ll.Say(0, "Blast off!")
        LLTimers:off(countdown)
    end
end)
```

### Delayed Execution

```lua
function delayedSay(message, delay)
    LLTimers:once(delay, function()
        ll.Say(0, message)
    end)
end

delayedSay("Hello in 2 seconds", 2.0)
delayedSay("Hello in 5 seconds", 5.0)
```

### Periodic Health Check

```lua
local health = 100

LLTimers:every(1.0, function(scheduled_time, interval)
    health = health - 1

    if health <= 0 then
        ll.Say(0, "Health depleted!")
        -- Timer continues running
    end

    if health % 10 == 0 then
        ll.Say(0, "Health: " .. health)
    end
end)
```

### Repeating Action with Pause

```lua
local active = true
local handler

handler = LLTimers:every(1.0, function()
    if not active then
        return  -- Skip execution but keep timer running
    end

    ll.Say(0, "Active tick")
end)

-- Later, pause without removing timer
active = false

-- Resume
active = true
```

### Timer Manager Pattern

```lua
local timers = {}

function startTimer(name, interval, callback)
    -- Stop existing timer with this name
    if timers[name] then
        LLTimers:off(timers[name])
    end

    -- Create and store new timer
    timers[name] = LLTimers:every(interval, callback)
end

function stopTimer(name)
    if timers[name] then
        LLTimers:off(timers[name])
        timers[name] = nil
    end
end

function stopAllTimers()
    for name, handler in pairs(timers) do
        LLTimers:off(handler)
    end
    timers = {}
end

-- Usage
startTimer("health", 1.0, function()
    ll.Say(0, "Health tick")
end)

startTimer("animation", 0.05, function()
    -- Update animation
end)

-- Later
stopTimer("health")
stopAllTimers()
```

## Best Practices

1. **Store handler references**: Always store the return value from timer creation if you might need to stop it later
2. **Clean up timers**: Remove timers you no longer need to avoid unnecessary processing
3. **Use appropriate intervals**: Don't use very short intervals (< 0.05s) unless necessary
4. **Consider one-time timers**: Use `once()` instead of `on()` + manual removal when appropriate
5. **Handle delays gracefully**: Use the `scheduled_time` parameter to detect and handle late execution
6. **Avoid heavy processing**: Keep timer callbacks lightweight to prevent lag

## Common Patterns

### Debouncing

Execute an action only after activity has stopped for a certain period:

```lua
local debounceTimer

function onActivity()
    -- Cancel pending timer
    if debounceTimer then
        LLTimers:off(debounceTimer)
    end

    -- Schedule new action
    debounceTimer = LLTimers:once(2.0, function()
        ll.Say(0, "Activity stopped for 2 seconds")
        debounceTimer = nil
    end)
end

-- Call this whenever activity occurs
LLEvents:on("touch_start", function(detected)
    onActivity()
end)
```

### Throttling

Limit how often an action can occur:

```lua
local canExecute = true

LLEvents:on("touch_start", function(detected)
    if not canExecute then
        ll.Say(0, "Please wait...")
        return
    end

    -- Execute action
    ll.Say(0, "Action executed!")

    -- Disable and re-enable after delay
    canExecute = false
    LLTimers:once(1.0, function()
        canExecute = true
    end)
end)
```

### Timeout Pattern

Perform an action if something doesn't happen within a time limit:

```lua
local timeoutTimer

function startOperation()
    ll.Say(0, "Operation started")

    timeoutTimer = LLTimers:once(5.0, function()
        ll.Say(0, "Operation timed out!")
        timeoutTimer = nil
    end)
end

function completeOperation()
    if timeoutTimer then
        LLTimers:off(timeoutTimer)
        timeoutTimer = nil
        ll.Say(0, "Operation completed successfully")
    end
end

-- Start operation
startOperation()

-- If this is called within 5 seconds, no timeout
LLEvents:on("touch_start", function(detected)
    completeOperation()
end)
```

### Retry Logic

```lua
function attemptAction(maxRetries)
    local retries = 0

    local function tryAction()
        local success = math.random() > 0.7  -- Simulate success/failure

        if success then
            ll.Say(0, "Action succeeded!")
        else
            retries = retries + 1
            if retries < maxRetries then
                ll.Say(0, "Attempt " .. retries .. " failed, retrying in 1 second...")
                LLTimers:once(1.0, tryAction)
            else
                ll.Say(0, "Max retries reached, giving up")
            end
        end
    end

    tryAction()
end

attemptAction(3)  -- Try up to 3 times
```

## Common Pitfalls

### Forgetting to Store Handler References

```lua
-- ✗ Can't stop this timer later
LLTimers:every(1.0, function()
    ll.Say(0, "Tick")
end)

-- ✓ Store the handler
local handler = LLTimers:every(1.0, function()
    ll.Say(0, "Tick")
end)
```

### Creating Multiple Timers Without Cleanup

```lua
-- ✗ Creates new timer on each touch, never cleans up old ones
LLEvents:on("touch_start", function(detected)
    LLTimers:every(1.0, function()
        ll.Say(0, "Timer tick")
    end)
end)

-- ✓ Manage timer lifecycle properly
local handler

LLEvents:on("touch_start", function(detected)
    if handler then
        LLTimers:off(handler)
    end
    handler = LLTimers:every(1.0, function()
        ll.Say(0, "Timer tick")
    end)
end)
```

### Using Very Short Intervals Unnecessarily

```lua
-- ✗ Excessive processing for most use cases
LLTimers:every(0.01, function()
    -- This fires 100 times per second!
end)

-- ✓ Use reasonable intervals
LLTimers:every(0.1, function()
    -- 10 times per second is usually enough
end)
```

## Comparison with LSL timer Event

Unlike LSL's single global timer:

- **Multiple timers**: Create as many timers as you need
- **Independent intervals**: Each timer has its own interval
- **Easy management**: Start and stop individual timers without affecting others
- **No state changes needed**: Timers work without state machinery

```lua
-- In SLua, these all run independently
LLTimers:every(1.0, function() ll.Say(0, "Timer 1") end)
LLTimers:every(2.0, function() ll.Say(0, "Timer 2") end)
LLTimers:every(5.0, function() ll.Say(0, "Timer 3") end)
```

## Summary

The `LLTimers` system provides flexible timer management in SLua:

- Use `LLTimers:every()` for recurring timers
- Use `LLTimers:once()` for one-time delayed execution
- Use `LLTimers:off()` to stop timers
- Multiple independent timers can run simultaneously
- Timer callbacks receive `scheduled_time` and `interval` parameters
- Timers can be modified during execution
- Catch-up protection prevents timer spam after lag

This system gives you precise control over scheduled execution without the limitations of LSL's single timer.

---

*This guide covers the LLTimers system for timer management in SLua. For event handling, see the [Events](./events/) documentation.*
