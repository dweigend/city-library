"""Read PNG color statistics using only the Python standard library."""
import collections
import hashlib
import json
import struct
import sys
import zlib
from pathlib import Path


def stats(path):
    blob = Path(path).read_bytes()
    offset, packed = 8, bytearray()
    while offset < len(blob):
        size = struct.unpack_from('>I', blob, offset)[0]
        kind = blob[offset + 4:offset + 8]
        payload = blob[offset + 8:offset + 8 + size]
        if kind == b'IHDR':
            width, height, depth, color, _, _, interlace = struct.unpack('>IIBBBBB', payload)
        if kind == b'IDAT':
            packed.extend(payload)
        offset += size + 12
    assert depth == 8 and color in (2, 6) and interlace == 0
    channels = 4 if color == 6 else 3
    data, stride, offset = zlib.decompress(packed), width * channels, 0
    previous = bytearray(stride)
    counts = collections.Counter()
    samples = {}
    for y in range(height):
        filter_kind = data[offset]
        offset += 1
        row = bytearray(data[offset:offset + stride])
        offset += stride
        for i in range(stride):
            left = row[i - channels] if i >= channels else 0
            above = previous[i]
            upper_left = previous[i - channels] if i >= channels else 0
            if filter_kind == 1:
                prediction = left
            elif filter_kind == 2:
                prediction = above
            elif filter_kind == 3:
                prediction = (left + above) // 2
            elif filter_kind == 4:
                p = left + above - upper_left
                distances = [abs(p - left), abs(p - above), abs(p - upper_left)]
                prediction = [left, above, upper_left][distances.index(min(distances))]
            else:
                prediction = 0
            row[i] = (row[i] + prediction) & 255
        for x in range(width):
            pixel = tuple(row[x * channels:(x + 1) * channels])
            counts[pixel] += 1
            if x in (0, width // 2, width - 1) and y in (0, height // 2, height - 1):
                samples[f'{x},{y}'] = pixel
        previous = row
    return {'file': str(path), 'sha256': hashlib.sha256(blob).hexdigest(), 'width': width, 'height': height, 'colorType': color, 'uniqueColors': len(counts), 'topColors': counts.most_common(12), 'samples': samples}


if __name__ == '__main__':
    print(json.dumps([stats(p) for p in sys.argv[1:]], indent=2))
