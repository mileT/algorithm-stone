import type { PythonLesson } from '../types'

export const pythonLessons: PythonLesson[] = [
  {
    id: 'arrays-hashing',
    category: 'Arrays & Hashing',
    title: 'Dicts & sets for O(1) lookup',
    summary:
      'Most array problems become easy once you trade space for time with a hash map or set.',
    concepts: ['dict', 'set', 'Counter', 'defaultdict', 'enumerate'],
    snippet: `from collections import Counter, defaultdict

def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

freq = Counter(nums)          # count frequencies
groups = defaultdict(list)    # auto-create empty lists`,
    tip: 'Prefer `in` checks on a set/dict over nested loops. Use `enumerate` when you need both index and value.',
  },
  {
    id: 'two-pointers',
    category: 'Two Pointers',
    title: 'Walk from both ends',
    summary:
      'Two pointers shrink or expand a window without allocating extra arrays.',
    concepts: ['left/right indices', 'sorted arrays', 'in-place writes'],
    snippet: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    tip: 'Sort first when order does not matter. For in-place work, keep a write index separate from the read index.',
  },
  {
    id: 'sliding-window',
    category: 'Sliding Window',
    title: 'Grow and shrink a window',
    summary:
      'Maintain a valid contiguous range while scanning left to right in linear time.',
    concepts: ['window bounds', 'frequency map', 'amortized O(n)'],
    snippet: `def longest_unique(s: str) -> int:
    seen: dict[str, int] = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
    tip: 'Only move `left` forward. Never reset it to 0 mid-scan — that destroys the O(n) guarantee.',
  },
  {
    id: 'stack',
    category: 'Stack',
    title: 'LIFO with list as stack',
    summary:
      'Python lists make excellent stacks. Use them for matching, monotonic builds, and undo patterns.',
    concepts: ['append/pop', 'monotonic stack', 'next greater element'],
    snippet: `def daily_temperatures(temps: list[int]) -> list[int]:
    ans = [0] * len(temps)
    stack: list[int] = []  # indices of decreasing temps
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    return ans`,
    tip: 'Store indices, not values, when you need distances or positions later.',
  },
  {
    id: 'binary-search',
    category: 'Binary Search',
    title: 'bisect and custom bounds',
    summary:
      'Search on sorted data or on an answer space. Know when to use `bisect` vs hand-rolled loops.',
    concepts: ['bisect_left', 'bisect_right', 'answer-space search'],
    snippet: `import bisect

def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# Insert position helpers
i = bisect.bisect_left(nums, target)`,
    tip: 'Write the loop invariant in a comment: what is true about `lo` and `hi` after each step?',
  },
  {
    id: 'linked-list',
    category: 'Linked List',
    title: 'Pointers as object references',
    summary:
      'In Python a node is just an object. Master dummy heads, fast/slow pointers, and reversal.',
    concepts: ['dummy node', 'fast/slow', 'in-place reverse'],
    snippet: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    tip: 'A dummy head (`dummy = ListNode(0); dummy.next = head`) removes awkward edge cases at the real head.',
  },
  {
    id: 'trees',
    category: 'Trees',
    title: 'Recursion & DFS helpers',
    summary:
      'Tree problems map naturally to recursive Python functions with clear base cases.',
    concepts: ['DFS', 'BFS with deque', 'None checks'],
    snippet: `from collections import deque

def max_depth(root) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def level_order(root) -> list[list[int]]:
    if not root:
        return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out`,
    tip: 'Always guard `if not root` first. For BFS, snapshot `len(q)` so each loop processes one level.',
  },
  {
    id: 'heap',
    category: 'Heap / Priority Queue',
    title: 'heapq for top-k',
    summary:
      'Python’s `heapq` is a min-heap. Negate values for a max-heap pattern.',
    concepts: ['heappush', 'heappop', 'nlargest', 'nsmallest'],
    snippet: `import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    from collections import Counter
    freq = Counter(nums)
    return heapq.nlargest(k, freq.keys(), key=freq.get)

# Min-heap of size k
heap: list[int] = []
for n in nums:
    heapq.heappush(heap, n)
    if len(heap) > k:
        heapq.heappop(heap)`,
    tip: 'For custom objects, push tuples `(priority, tie_breaker, item)` so comparisons stay valid.',
  },
  {
    id: 'backtracking',
    category: 'Backtracking',
    title: 'Choose, explore, un-choose',
    summary:
      'Build candidates with recursion, then undo mutations so sibling branches stay clean.',
    concepts: ['path mutation', 'copy results', 'pruning'],
    snippet: `def subsets(nums: list[int]) -> list[list[int]]:
    res: list[list[int]] = []
    path: list[int] = []

    def dfs(start: int) -> None:
        res.append(path.copy())  # snapshot!
        for i in range(start, len(nums)):
            path.append(nums[i])
            dfs(i + 1)
            path.pop()           # backtrack

    dfs(0)
    return res`,
    tip: 'Always `path.copy()` (or `path[:]`) when appending to results — otherwise every entry shares one list.',
  },
  {
    id: 'tries',
    category: 'Tries',
    title: 'Nested dicts as tries',
    summary:
      'A trie is a tree of characters. In Python, nested dicts (or a small Node class) work great.',
    concepts: ['nested dict', 'endswith marker', 'prefix search'],
    snippet: `class Trie:
    def __init__(self):
        self.root: dict = {}

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = True  # end marker

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return '#' in node`,
    tip: 'Use a distinct end-of-word marker (`#` or `is_end`) so prefixes are not confused with full words.',
  },
  {
    id: 'graphs',
    category: 'Graphs',
    title: 'Adjacency lists & visited sets',
    summary:
      'Build graphs with `defaultdict(list)`, then DFS/BFS with a `visited` set to avoid cycles.',
    concepts: ['adjacency list', 'visited', 'deque BFS'],
    snippet: `from collections import defaultdict, deque

def build_graph(edges: list[list[int]]):
    g = defaultdict(list)
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    return g

def bfs(start: int, g) -> list[int]:
    seen, order = {start}, []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for nei in g[node]:
            if nei not in seen:
                seen.add(nei)
                q.append(nei)
    return order`,
    tip: 'Mark visited when you enqueue (BFS) or when you enter a node (DFS) — pick one rule and stick to it.',
  },
  {
    id: 'advanced-graphs',
    category: 'Advanced Graphs',
    title: 'Dijkstra with heapq',
    summary:
      'Weighted shortest paths use a priority queue. Track best-known distances carefully.',
    concepts: ['Dijkstra', 'priority queue', 'distance map'],
    snippet: `import heapq
from collections import defaultdict

def dijkstra(n: int, edges, src: int) -> list[int]:
    g = defaultdict(list)
    for u, v, w in edges:
        g[u].append((v, w))
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in g[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
    tip: 'Skip stale heap entries with `if d > dist[u]: continue` instead of decreasing keys in-place.',
  },
  {
    id: 'dp-1d',
    category: '1-D Dynamic Programming',
    title: 'Bottom-up arrays',
    summary:
      'Define `dp[i]` clearly, seed base cases, then fill left to right.',
    concepts: ['state definition', 'transition', 'rolling variables'],
    snippet: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

def rob(nums: list[int]) -> int:
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1`,
    tip: 'Name the state in English first: “`dp[i]` = best answer using the first i houses.” Then code the transition.',
  },
  {
    id: 'dp-2d',
    category: '2-D Dynamic Programming',
    title: 'Grids and string matrices',
    summary:
      'Two indices usually mean a 2D table. Watch out for off-by-one on empty prefixes.',
    concepts: ['grid DP', 'LCS-style tables', 'space optimization'],
    snippet: `def unique_paths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[-1]

def longest_common_subseq(a: str, b: str) -> int:
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i, ca in enumerate(a, 1):
        for j, cb in enumerate(b, 1):
            if ca == cb:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[-1][-1]`,
    tip: 'Add a padding row/column of zeros so base cases stay out of the main loops.',
  },
  {
    id: 'greedy',
    category: 'Greedy',
    title: 'Sort then commit locally',
    summary:
      'Greedy works when a local best choice never blocks the global optimum — prove it or sort first.',
    concepts: ['sort by key', 'running extrema', 'interval picking'],
    snippet: `def jump_game(nums: list[int]) -> bool:
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True

intervals.sort(key=lambda x: x[1])  # finish early first`,
    tip: 'If you cannot explain why the greedy choice is safe, fall back to DP or search.',
  },
  {
    id: 'intervals',
    category: 'Intervals',
    title: 'Sort by start or end',
    summary:
      'Almost every interval problem starts by sorting. Then merge, or pick non-overlapping ranges.',
    concepts: ['sort by start', 'merge sweep', 'min rooms'],
    snippet: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort()
    out = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out`,
    tip: 'Decide whether to sort by start (merge) or by end (maximum non-overlapping set).',
  },
  {
    id: 'math-geometry',
    category: 'Math & Geometry',
    title: 'Integer math & itertools',
    summary:
      'Watch overflow-free integer division, gcd, and careful matrix rotations in-place.',
    concepts: ['// vs /', 'math.gcd', 'zip(*matrix)'],
    snippet: `import math

def gcd_of_strings(a: str, b: str) -> str:
    if a + b != b + a:
        return ''
    return a[: math.gcd(len(a), len(b))]

# Rotate matrix 90° clockwise
rotated = [list(row) for row in zip(*matrix[::-1])]`,
    tip: 'Use `//` for floor division. `zip(*grid)` is a fast transpose idiom worth memorizing.',
  },
  {
    id: 'bit-manipulation',
    category: 'Bit Manipulation',
    title: 'Bitwise operators',
    summary:
      'XOR cancels duplicates, shifts multiply/divide by two, and masks isolate bits.',
    concepts: ['XOR', 'shifts', 'masks', 'n & (n-1)'],
    snippet: `def single_number(nums: list[int]) -> int:
    x = 0
    for n in nums:
        x ^= n
    return x

def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1  # clear lowest set bit
        count += 1
    return count`,
    tip: '`n & (n - 1)` clears the lowest set bit — perfect for counting or power-of-two checks.',
  },
]

export function lessonForCategory(category: string): PythonLesson | undefined {
  return pythonLessons.find((l) => l.category === category)
}
