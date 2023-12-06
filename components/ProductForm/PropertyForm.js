

export default function PropertyForm({ property, value, addProperty, getQuantityForProperty }) {


    return (
        <div key={index} className="flex mx-1 gap-1">
            {console.log('productProperties?.values?.[value]?.quantity', productProperties)}
            <p >{value}</p>
            <input
                type="number"
                className=" p-2 w-14 h-8 mb-0"
                placeholder="0"
                onChange={(e) => addProperty({ name: property.name, value, quantity: e.target.value })}
                value={getQuantityForProperty(property.name, value)}
            />
        </div>
    )
}