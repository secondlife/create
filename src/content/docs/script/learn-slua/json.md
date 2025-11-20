---
title: JSON
description: JSON encoding and decoding in SLua with LLJSON
---

## Introduction

SLua provides the `lljson` library for encoding Lua values to JSON strings and decoding JSON strings back to Lua values. This is essential for data serialization, HTTP requests, and communicating with external services.

## Basic Usage

### Encoding to JSON

Convert Lua values to JSON strings with `lljson.encode()`:

```lua
local data = {
    name = "Alice",
    age = 30,
    active = true
}

local json = lljson.encode(data)
-- json = '{"name":"Alice","age":30,"active":true}'

ll.Say(0, json)
```

### Decoding from JSON

Convert JSON strings back to Lua values with `lljson.decode()`:

```lua
local json = '{"name":"Bob","score":100,"verified":false}'
local data = lljson.decode(json)

ll.Say(0, data.name)      -- "Bob"
ll.Say(0, data.score)     -- 100
ll.Say(0, data.verified)  -- false
```

## Data Type Mapping

### Basic Types

JSON types map to Lua types naturally:

```lua
-- Numbers
lljson.encode(42)          -- "42"
lljson.encode(3.14)        -- "3.14"

-- Strings
lljson.encode("hello")     -- '"hello"'

-- Booleans
lljson.encode(true)        -- "true"
lljson.encode(false)       -- "false"
```

### Null Values

JSON null is represented by `lljson.null`:

```lua
-- Encoding null
local data = {
    value = lljson.null
}
lljson.encode(data)  -- '{"value":null}'

-- Top-level nil also becomes null
lljson.encode(nil)   -- "null"

-- But table keys with nil are omitted
local obj = {
    present = "here",
    missing = nil  -- This key won't appear in JSON
}
lljson.encode(obj)  -- '{"present":"here"}'

-- Use lljson.null to explicitly include null values
local obj2 = {
    present = "here",
    nullable = lljson.null
}
lljson.encode(obj2)  -- '{"present":"here","nullable":null}'
```

When decoding, JSON null becomes `lljson.null`:

```lua
local data = lljson.decode('{"value":null}')
-- data.value == lljson.null (true)
```

### Objects vs Arrays

#### Objects (Dictionaries)

Tables with string keys encode as JSON objects:

```lua
local person = {
    name = "Charlie",
    age = 25
}
lljson.encode(person)  -- '{"name":"Charlie","age":25}'
```

#### Arrays

Tables with numeric indices encode as JSON arrays:

```lua
local numbers = {1, 2, 3, 4, 5}
lljson.encode(numbers)  -- '[1,2,3,4,5]'

local fruits = {"apple", "banana", "cherry"}
lljson.encode(fruits)  -- '["apple","banana","cherry"]'
```

#### Empty Tables

Empty tables `{}` encode as JSON objects by default:

```lua
lljson.encode({})  -- '{}'
```

To encode an empty table as an array, use `lljson.empty_array`:

```lua
lljson.encode(lljson.empty_array)  -- '[]'
```

Or set the `lljson.array_mt` metatable:

```lua
local empty = {}
setmetatable(empty, lljson.array_mt)
lljson.encode(empty)  -- '[]'
```

#### Sparse Arrays

Arrays with gaps are padded with nulls:

```lua
local sparse = {}
sparse[1] = "first"
sparse[4] = "fourth"

lljson.encode(sparse)  -- '["first",null,null,"fourth"]'
```

**Warning:** Extremely sparse arrays (large gaps) will be rejected to prevent excessive memory usage.

### Special Numeric Values

#### Infinity

Positive and negative infinity encode as non-standard JSON literals:

```lua
lljson.encode(math.huge)   -- "1e9999"
lljson.encode(-math.huge)  -- "-1e9999"
```

When decoding, these become Lua infinity values:

```lua
local data = lljson.decode("1e9999")
-- data == math.huge (true)
```

#### NaN (Not a Number)

NaN values encode as the non-standard JSON literal `"NaN"`:

```lua
local nan = 0/0
lljson.encode(nan)  -- "NaN"
```

When decoding:

```lua
local value = lljson.decode("NaN")
-- value is NaN (check with value ~= value, which is true for NaN)
```

### Second Life Types

#### Keys (Strings)

Second Life keys (UUIDs) are strings and encode as JSON strings:

```lua
local avatar_id = "12345678-1234-1234-1234-123456789abc"
lljson.encode(avatar_id)  -- '"12345678-1234-1234-1234-123456789abc"'
```

#### Vectors

Vectors encode as their string representation:

```lua
local pos = vector(1, 2.5, 3.14286)
lljson.encode(pos)  -- '"<1,2.5,3.14286>"'
```

#### Rotations (Quaternions)

Rotations encode as their string representation:

```lua
local rot = rotation(0, 0, 0, 1)
lljson.encode(rot)  -- '"<0,0,0,1>"'
```

#### Buffers

Buffers are base64 encoded:

```lua
local buf = buffer.fromstring("Hello")
lljson.encode(buf)  -- Base64 encoded string
```

## Unicode Support

LLJSON handles Unicode properly, including escape sequences:

```lua
-- Decoding Unicode escapes
local data = lljson.decode('"\\u0048\\u0065\\u006C\\u006C\\u006F"')
-- data = "Hello"

-- Encoding Unicode characters
lljson.encode("Hello 世界")  -- Properly encoded UTF-8
```

## Error Handling

### Encoding Errors

LLJSON will raise errors for:

**Mixed table keys:**
```lua
-- Mixed numeric and string keys aren't allowed
local bad = {
    [1] = "one",
    name = "test"  -- Error: can't mix array and object keys
}
lljson.encode(bad)  -- Raises error
```

**Functions:**
```lua
local bad = {
    func = function() end  -- Error: cannot encode functions
}
lljson.encode(bad)  -- Raises error
```

**Self-referential structures:**
```lua
local t = {}
t.self = t  -- Circular reference
lljson.encode(t)  -- Raises error when recursion limit exceeded
```

**Oversized payloads:**
```lua
-- Extremely large data structures may exceed size limits
```

### Decoding Errors

LLJSON will raise errors for:

**Invalid JSON syntax:**
```lua
lljson.decode("{invalid}")  -- Raises error
```

**Oversized string literals:**
```lua
-- Excessively long strings may be rejected
```

Use `pcall()` to handle errors gracefully:

```lua
local success, result = pcall(lljson.decode, json_string)

if success then
    ll.Say(0, "Parsed successfully")
    -- Use result
else
    ll.Say(0, "Parse error: " .. result)
end
```

## Advanced Features

### Custom Serialization

Objects with a `__tojson()` metamethod use custom serialization:

```lua
local Point = {}
Point.__index = Point

function Point:new(x, y)
    local obj = {x = x, y = y}
    setmetatable(obj, self)
    return obj
end

function Point:__tojson()
    return {
        type = "Point",
        coordinates = {self.x, self.y}
    }
end

local p = Point:new(10, 20)
lljson.encode(p)  -- '{"type":"Point","coordinates":[10,20]}'
```

### Forcing Array Encoding

Use `lljson.array_mt` to ensure table encodes as array:

```lua
local data = {10, 20, 30}
setmetatable(data, lljson.array_mt)
lljson.encode(data)  -- '[10,20,30]'

-- Useful for guaranteeing array encoding even if table becomes empty
local items = {}
setmetatable(items, lljson.array_mt)
lljson.encode(items)  -- '[]' (array, not object)
```

### Nested Structures

Complex nested data structures work naturally:

```lua
local data = {
    users = {
        {name = "Alice", scores = {95, 87, 92}},
        {name = "Bob", scores = {78, 85, 90}},
    },
    timestamp = 1234567890,
    metadata = {
        version = "1.0",
        verified = true
    }
}

local json = lljson.encode(data)
local decoded = lljson.decode(json)

-- Access nested values
ll.Say(0, decoded.users[1].name)        -- "Alice"
ll.Say(0, decoded.users[1].scores[2])   -- 87
```

## Practical Examples

### Encoding Request Data

```lua
local request_data = {
    action = "update",
    user_id = "12345",
    values = {
        score = 100,
        level = 5
    }
}

local json = lljson.encode(request_data)
ll.OwnerSay(`Request data: {json}`)
```

### Parsing Response Data

```lua
local response_json = `{"success": true, "message": "Update complete"}`
local success, data = pcall(lljson.decode, response_json)

if success then
    ll.Say(0, `Response: {data.message}`)
else
    ll.Say(0, "Failed to parse JSON response")
end
```

### Storing Configuration

```lua
-- Save configuration as JSON
local config = {
    settings = {
        volume = 0.8,
        notifications = true,
        theme = "dark"
    },
    user_preferences = {
        language = "en",
        timezone = "UTC"
    }
}

local json_config = lljson.encode(config)
-- Store json_config in object description or send to server

-- Later, restore configuration
local restored = lljson.decode(json_config)
ll.Say(0, "Volume: " .. restored.settings.volume)
```

### Data Exchange Between Scripts

```lua
-- Script 1: Encode and send
local message = {
    event = "player_joined",
    player = {
        name = "Alice",
        position = vector(10, 20, 30)
    }
}

ll.MessageLinked(LINK_THIS, 0, lljson.encode(message), "")

-- Script 2: Receive and decode
LLEvents:on("link_message", function(sender, num, str, id)
    local success, data = pcall(lljson.decode, str)

    if success then
        ll.Say(0, data.event .. ": " .. data.player.name)
    end
end)
```

### Building API Responses

```lua
function createResponse(success, message, data)
    local response = {
        success = success,
        message = message,
        timestamp = os.time()
    }

    if data then
        response.data = data
    else
        response.data = lljson.null
    end

    return lljson.encode(response)
end

-- Usage
local json = createResponse(true, "Operation completed", {
    items_processed = 42
})

ll.Say(0, json)
-- '{"success":true,"message":"Operation completed","timestamp":1234567890,"data":{"items_processed":42}}'
```

## Best Practices

1. **Always validate decoded data**: Use `pcall()` to catch parse errors
2. **Be explicit about nulls**: Use `lljson.null` for JSON null values, not `nil`
3. **Mark arrays explicitly**: Use `lljson.array_mt` for tables that should always be arrays
4. **Avoid circular references**: Ensure your data structures don't reference themselves
5. **Handle special numbers**: Be aware of how infinity and NaN are represented
6. **Watch for encoding limitations**: Functions and some metatables cannot be encoded
7. **Consider size limits**: Very large payloads may be rejected

## Common Patterns

### Safe JSON Parsing

```lua
function safeJsonDecode(json_string, default_value)
    local success, result = pcall(lljson.decode, json_string)

    if success then
        return result
    else
        ll.OwnerSay("JSON parse error: " .. result)
        return default_value
    end
end

-- Usage
local data = safeJsonDecode(response_body, {})
```

### Building JSON Arrays

```lua
local items = {}
setmetatable(items, lljson.array_mt)

for i = 1, 5 do
    table.insert(items, {
        id = i,
        value = "Item " .. i
    })
end

lljson.encode(items)
-- '[{"id":1,"value":"Item 1"},{"id":2,"value":"Item 2"},...]'
```

### Conditional Fields

```lua
function encodeUser(user, include_email)
    local data = {
        id = user.id,
        name = user.name
    }

    if include_email then
        data.email = user.email
    end
    -- If include_email is false, email field is simply omitted

    return lljson.encode(data)
end
```

## Common Pitfalls

### Empty Table Ambiguity

```lua
-- ✗ Empty table defaults to object
lljson.encode({})  -- '{}' (might expect '[]')

-- ✓ Be explicit for arrays
lljson.encode(lljson.empty_array)  -- '[]'
```

### Nil vs Null

```lua
-- ✗ nil omits the key
local data = {key = nil}
lljson.encode(data)  -- '{}'

-- ✓ Use lljson.null for explicit null
local data = {key = lljson.null}
lljson.encode(data)  -- '{"key":null}'
```

### Mixed Key Types

```lua
-- ✗ Don't mix numeric and string keys
local bad = {
    [1] = "one",
    name = "test"
}
lljson.encode(bad)  -- Error

-- ✓ Use consistent key types
local array = {" one", "two"}  -- Numeric indices only
lljson.encode(array)  -- '["one","two"]'

local object = {first = "one", second = "two"}  -- String keys only
lljson.encode(object)  -- '{"first":"one","second":"two"}'
```

### Forgotten pcall

```lua
-- ✗ Unprotected decode can crash script
local data = lljson.decode(untrusted_input)

-- ✓ Always protect against bad input
local success, data = pcall(lljson.decode, untrusted_input)
if success then
    -- Use data
end
```

## Summary

The `lljson` library provides robust JSON handling in SLua:

- Use `lljson.encode()` to convert Lua values to JSON
- Use `lljson.decode()` to parse JSON strings
- `lljson.null` represents JSON null explicitly
- Empty tables default to objects; use `lljson.array_mt` or `lljson.empty_array` for arrays
- Special values like infinity and NaN have non-standard representations
- Second Life types (vectors, keys) encode as strings
- Always use `pcall()` when decoding untrusted JSON
- Custom serialization available via `__tojson()` metamethod

JSON is the standard format for data exchange, making `lljson` essential for HTTP communication, data storage, and inter-script messaging.

---

*This guide covers the LLJSON library for JSON encoding and decoding in SLua.*
