def suggest_limit(data):
    if not data:
        return "No data"

    avg = sum(int(d["amount"]) for d in data) / len(data)

    if avg > 500:
        return "⚠️ Reduce spending!"
    else:
        return "✅ Good budgeting!"