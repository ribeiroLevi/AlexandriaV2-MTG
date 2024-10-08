import { useEffect, useState } from 'react';
import { Card } from '../views/cardsList';
import { Heart, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import axios from 'axios';
import { useFavorites } from '../context/UseFavorites';
interface CardViewProps {
  card: Card;
  setToDeckCards: (card: Card) => void;

}

interface PrintVariant {
  id: string;
  image_uris: {
    normal: string;
  };
  name: string;
}


export function CardComponent({ card, setToDeckCards }: CardViewProps) {
  const [printVariants, setPrintVariants] = useState<PrintVariant[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string>(
    card.image_uris?.normal
  );

  const { isOnFavoriteList, toggleFavorites } = useFavorites()

  const handleAddToDeck = () => {
    toast('Card added', {
      description: `${card.quantity}x ${card.name} has been added to the deck!, ${card.set_name}`,
    });
    setToDeckCards(card);
  };

  const {
    id,
    image_uris,
    cmc,
    power,
    toughness,
    flavor_text,
    name,
    rarity,
    set_name,
    prints_search_uri,
    type_line,
    oracle_text,
  } = card;

  const handleVariantClick = (imageUri: string) => {
    setSelectedImageUri(imageUri);
  };

  useEffect(() => {
    if (prints_search_uri) {
      axios
        .get(prints_search_uri)
        .then((response) => setPrintVariants(response.data.data))
        .catch((error) =>
          console.error('Error fetching print variants:', error)
        );
    }
  }, [prints_search_uri]);

  return (
    <Dialog onOpenChange={() => setSelectedImageUri(image_uris.normal)}>
      <div className=" hover:scale-125 w-80 mt-2 mx-6 hover:cursor-pointer transition-all ease-in-out delay-150">
        {image_uris && image_uris.normal && (
          <DialogTrigger>
            <img id={id} src={image_uris.large} className="rounded-xl" />
          </DialogTrigger>
        )}
      </div>
      <DialogContent className=" w-full lg:w-[1000px] bg-orange-200 bg-[url('magicLogo.svg')]">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-orange-800">
            {name}<br />
          </DialogTitle>
          <DialogDescription className="text-2xl text-orange-800">
            {type_line}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row items-center justify-between">
          <div className='flex flex-col justify-start h-full'>
            <div className="w-96 gap-4 h-full flex flex-col justify-start">
              <div >
                <p className="text-2xl font-bold text-orange-800">
                  Mana Cost:{' '}
                  <span className="text-orange-700 font-normal"> {cmc}</span>
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">Text:</p>
                <p className="text-orange-700 text-xl">{oracle_text}</p>
              </div>
              <div className={` ${flavor_text ? 'block pr-4' : 'hidden p-0'}`}>
                <p className="text-2xl font-bold text-orange-800">Flavor Text:</p>
                <p className="text-xl text-orange-700">{flavor_text}</p>
              </div>
              <div className="flex flex-row">
                <div>
                  <p>
                    <p
                      className={`text-2xl  text-orange-800 font-bold ${power && toughness ? 'block pr-4' : 'hidden p-0'
                        }`}
                    >
                      P/T:
                      <span className="text-orange-700 text-2xl font-normal pl-2">
                        {power}/{toughness}
                      </span>
                    </p>
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-800 ">
                    Rarity:
                    <span className="text-orange-700 text-2xl capitalize pl-2 font-normal">
                      {rarity}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">
                  Collection:{' '}
                  <span className="text-orange-700 text-2xl capitalize font-normal">
                    {set_name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3 ">
              <Heart
                className={`stroke-orange-900 cursor-pointer size-7 ${isOnFavoriteList(id) ? 'fill-orange-900' : 'fill-orange-200'}`}
                onClick={() => toggleFavorites(id)}
              />
              <PlusCircle
                className="stroke-orange-800 size-7 cursor-pointer"
                onClick={handleAddToDeck}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div>
              
              {image_uris && image_uris.normal && (
                   <img
                  id={id}
                  src={selectedImageUri}
                  className="rounded-3xl w-96"
                />
              )}
            </div>
            <div
              className={`max-w-20 overflow-auto ${printVariants ? 'block' : 'bg-orange-800'
                } `}
            >
              <div className="size-16 cursor-pointer ">
                {printVariants.map((variant) => (
                  <img
                    key={variant.id}
                    src={variant.image_uris?.normal}
                    alt={variant.name}
                    className="my-2 rounded-sm"
                    onClick={() =>
                      handleVariantClick(variant.image_uris?.normal)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
